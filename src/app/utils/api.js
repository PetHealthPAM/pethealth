const DOG_BREEDS_API_URL = 'https://api.thedogapi.com/v1/breeds';
const CAT_BREEDS_API_URL = 'https://api.thecatapi.com/v1/breeds';


export const fetchDogBreeds = async () => {
    try {
        const response = await fetch(DOG_BREEDS_API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar raças de cães:', error);
        return [];
    }
};

export const fetchCatBreeds = async () => {
    try {
        const response = await fetch(CAT_BREEDS_API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar raças de gatos:', error);
        return [];
    }
};

