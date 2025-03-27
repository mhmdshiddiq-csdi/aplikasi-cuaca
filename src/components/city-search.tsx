import { useState } from "react"
import { Button } from "./ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Loader2, Search } from "lucide-react"
import { useLocationQuery } from "@/hooks/use-weather"
import { useNavigate } from "react-router-dom"

const CitySearch = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const {data: locations, isLoading} = useLocationQuery(query);

  const handleSelect = (cityData: string) => {
    const [lot, lan, name, country] = cityData.split("|");

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
        <CommandGroup heading="Favorites">
          <CommandItem>Calendar</CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Recent Search">
          <CommandItem>Calendar</CommandItem>
          </CommandGroup>
          
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
