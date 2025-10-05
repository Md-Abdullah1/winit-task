const Product = require("../models/Product");

function toNumberOrUndefined(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

async function list(req, res) {
  try {
    const { search } = req.query || {};
    const q = {};
    if (search) {
      const rx = new RegExp(String(search).trim(), "i");
      q.$or = [{ sku: rx }, { name: rx }, { brand: rx }, { category: rx }];
    }
    const products = await Product.find(q).sort({ updatedAt: -1 }).limit(500);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

async function create(req, res) {
  try {
    const body = req.body || {};
    if (!body.sku || !body.name) {
      return res.status(400).json({ message: "sku and name are required" });
    }
    const doc = await Product.create({
      sku: String(body.sku).trim(),
      name: String(body.name).trim(),
      category: body.category || undefined,
      brand: body.brand || undefined,
      uom: body.uom || undefined,
      pack: body.pack || undefined,
      mrp: toNumberOrUndefined(body.mrp),
      stock: toNumberOrUndefined(body.stock) ?? 0,
      reserved: toNumberOrUndefined(body.reserved) ?? 0,
      available: toNumberOrUndefined(body.available) ?? 0,
      avg: toNumberOrUndefined(body.avg) ?? 0,
    });
    res.status(201).json(doc);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Product with this sku already exists" });
    }
    res.status(500).json({ message: "Failed to create product" });
  }
}

module.exports = { list, create };




