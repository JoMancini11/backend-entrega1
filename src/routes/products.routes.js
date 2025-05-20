import { Router } from 'express';
import ProductModel from '../models/Product.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filters = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filters.status = query === 'true';
      } else {
        filters.category = query;
      }
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const result = await ProductModel.paginate(filters, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true
    });

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = result;
    const baseUrl = req.baseUrl;
    const buildLink = (p) => `${baseUrl}?page=${p}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    res.json({
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: result.page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(prevPage) : null,
      nextLink: hasNextPage ? buildLink(nextPage) : null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener productos',
      error: error.message || 'Error desconocido'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }

    const exist = await ProductModel.findOne({ code });
    if (exist) {
      return res.status(400).json({ status: 'error', message: 'El código ya existe' });
    }

    const newProduct = await ProductModel.create({
      ...req.body,
      status: true,
      thumbnails: req.body.thumbnails || []
    });

    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al crear producto',
      error: error.message || 'Error desconocido'
    });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const update = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!update) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', payload: update });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar producto', error });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto', error });
  }
});

export default router;
