import { Router } from 'express';
import { Category } from '../models/mongoose/categories.js';


export const categoryRouter = Router();

categoryRouter.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
});

categoryRouter.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }
    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ message: 'Categoría agregada' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'La categoría ya existe' });
        }
        res.status(400).json({ message: 'Error al agregar categoría' });
    }
});

categoryRouter.delete('/:cid', async (req, res) => {
    try {
        const categoryId = req.params.cid;

        const response = await Category.findByIdAndDelete(categoryId);
        
        if(!response){
            throw new Error('Ya fue eliminada.')
        }else{
            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría' });
    }
});

