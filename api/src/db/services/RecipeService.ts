import { isNil, kebabCase } from "lodash";

import * as ingredientDal from "../dal/ingredient";
import * as recipeDal from "../dal/recipe";
import { GetAllRecipesFilters } from "../dal/types";
import { RecipeInput, RecipeOutput } from "../models/Recipe";

export const create = async (payload: RecipeInput): Promise<RecipeOutput> => {
    const slug = kebabCase(payload.title)
    const slugExists = await recipeDal.checkSlugExists(slug)

    payload.slug = slugExists ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug

    if (!isNil(payload.ingredients)) {
        const ingredients = await Promise.all(payload.ingredients.map(ingredientDal.findOrCreate))

        payload.ingredients = ingredients
    }

    return recipeDal.create(payload)
}

export const getById = async (id: number): Promise<RecipeOutput> => {
    return recipeDal.getById(id)
}

export const update = async (id: number, payload: Partial<RecipeInput>): Promise<RecipeOutput> => {
    if (payload.title) {
        const slug = kebabCase(payload.title)
        const slugExists = await recipeDal.checkSlugExists(slug)

        payload.slug = slugExists ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug
    }

    return recipeDal.update(id, payload)
}

export const deleteById = async (id: number): Promise<boolean> => {
    return recipeDal.deleteById(id)
}

export const getAll = async (filters: GetAllRecipesFilters): Promise<RecipeOutput[]> => {
    return recipeDal.getAll(filters)
}
