import { useState } from "react"
import { Button } from "./ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Clock, Loader2, Search, XCircle } from "lucide-react"
import { useLocationQuery } from "@/hooks/use-weather"
import { useNavigate } from "react-router-dom"
import { useSearchHistory } from "@/hooks/use-search-history"
import { format } from "date-fns"

const CitySearch = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const {data: locations, isLoading} = useLocationQuery(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lot, lan, name, country] = cityData.split("|");

    addToHistory.mutate({
      query,
      name: name, 
      lat: parseFloat(lot),
      lon: parseFloat(lan),
      country: country
    })

    setOpen(false)
    navigate(`/city/${name}?lat=${lot}&lon=${lan}`);
  }
  return (
    <>
      <Button onClick={() => setOpen(true)} variant={"outline"} className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
        <Search className="h-4 w-4 mr-2"/>
        Search Cities...
      </Button>
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search cities..." value={query} onValueChange={setQuery} />
        <CommandList>
          { query.length > 2 && !isLoading &&
            <CommandEmpty>No cities found.</CommandEmpty>
          }
        {/* <CommandGroup heading="Favorites">
          <CommandItem>Calendar</CommandItem>
        </CommandGroup> */}

          {history.length > 0 &&
          <>
            <CommandSeparator /> 
            <CommandGroup>
              <div className="flex items-center justify-between px-2 my-2"> 
                <p className="text-xs text-muted-foreground">Recent Searches</p>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => clearHistory.mutate()}
                >
                  <XCircle className="h-4 w-4"/>
                  Clear
                </Button>
              </div>
              {history.map((location) => 
                <CommandItem key={`${location.lat}-${location.lon}`} value={`${location.lat}|${location.lon}|${location.name}|${location.country}`} onSelect={handleSelect}>
                  <Clock className="h-4 w-4 mr-2"/>
                  {location.name}
                  {location.state && (
                    <span className="text-sm text-muted-foreground">, {location.state}</span>
                  )}
                  <span className="text-sm text-muted-foreground">, {location.country}</span>
                  <span>{format(location.searchedAt, "MMMM d, h:mm a")}</span>
                </CommandItem>
              )}
            </CommandGroup>
          </>
          }
          
        <CommandSeparator />
          {locations && locations.length > 0 && (
              <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => {
                return <CommandItem key={`${location.lat}-${location.lon}`} value={`${location.lat}|${location.lon}|${location.name}|${location.country}`} onSelect={handleSelect}>
                  <Search className="h-4 w-4 mr-2"/>
                  {location.name}
                  {location.state && (
                    <span className="text-sm text-muted-foreground">, {location.state}</span>
                  )}
                  <span className="text-sm text-muted-foreground">, {location.country}</span>
                </CommandItem>
              })}
              
              </CommandGroup>
          )}
      </CommandList>
    </CommandDialog>
    </>
  )
}

export default CitySearch
