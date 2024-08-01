import express from "express";
import { promisfy } from "promisfy";
import { createClient } from "redis";

const client = createClient();

const clientSetAsync = promisfy(client.set, client);
const clientGetAsync = promisfy(client.get, client);
const app = express();

const listProducts = [
  { id: 1, name: "Suitcase 250", price: 50, stock: 4 },
  { id: 2, name: "Suitcase 450", price: 100, stock: 10 },
  { id: 3, name: "Suitcase 650", price: 350, stock: 2 },
  { id: 4, name: "Suitcase 1050", price: 550, stock: 5 },
];

function getItemById(itemId) {
  return listProducts.find((prod) => prod.id === itemId);
}

async function reserveStockById(itemId, stock) {
  return await clientSetAsync(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  return await clientGetAsync(`item.${itemId}`);
}

function getItemMiddleware(req, res, next) {
  const itemId = Number.parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return res.send(JSON.stringify({ status: "Product not found" }));
  }

  req.item = item;
  next();
}

app.use((_, res, next) => {
  res.json = (body) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(body));
  };
  next();
});

app.get("/list_products", (_, res) => {
  res.json(
    listProducts.map(({ id, name, price, stock }) => ({
      itemId: id,
      itemName: name,
      price,
      initialAvailableQuantity: stock,
    })),
  );
});

app.get("/list_products/:itemId", getItemMiddleware, async (req, res) => {
  const {
    item: { id, name, price, stock },
  } = req;

  res.json({
    itemId: id,
    itemName: name,
    price,
    initialAvailableQuantity: stock,
    currentQuantity: (await getCurrentReservedStockById(id)) || stock,
  });
});

app.get("/reserve_product/:itemId", getItemMiddleware, async (req, res) => {
  const {
    item: { id, stock },
  } = req;

  let quantity = await getCurrentReservedStockById(id);

  if (quantity === null) {
    quantity = stock;
  }

  if (quantity > 0) {
    await reserveStockById(id, quantity - 1);
    res.json({ status: "Reservation confirmed", itemId: id });
  } else {
    res.json({ status: "Not enough stock available", itemId: id });
  }
});

client.flushdb(() =>
  app.listen(1245, () => console.log("server is running on port 1245")),
);
