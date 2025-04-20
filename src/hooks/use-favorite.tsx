import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface FavoriteCity {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>("favorites", [])
  const queryClient = useQueryClient();


  const favoriteQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity
  })


  const addToFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}-${Date.now()}`,
        addedAt: Date.now()
      }

      const exists = favorites.some((fav) => fav.id === newFavorite.id)
      if(exists) return favorites
      const newFavorites = [ ...favorites, newFavorite].slice(0, 10);

      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"]
      })
    }
  })

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((city) => city.id !== city.id);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
            queryClient.invalidateQueries({
        queryKey: ["favorites"]
      })
    }
  })

  return {
    favorites: favoriteQuery.data || [],
    addToFavorite:addToFavorite,
    removeFavorite: removeFavorite,
    isFavorite: (lat: number, lon: number) => favorites.some((city) => city.lat === lat && city.lon === lon)
  }
}