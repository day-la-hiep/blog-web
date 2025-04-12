
import * as React from "react";
import { CircleX, Cross, Delete, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

type Category = {
  name: string;
  slug: string;
};
interface CategorySelectorProps {
  value: Category[],
  items: Category[]
  onChange: (value: Category[]) => void;
}

const SelectDropdown = ({ items, onChange, value }: CategorySelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = React.useCallback((selectedItem: Category, value : Category[]) => {
    if (!value.find((item) => item.slug == selectedItem.slug)) {
      onChange([...value, selectedItem])
    }
    setOpen(false);
    setInputValue("")
  }, [])

  const handleRemove = React.useCallback((selectedItem : Category, value: Category[]) => {
    const newValue = value.filter((item) => item.slug != selectedItem.slug)
    onChange(newValue)
  }, [])

  return (
    <>

      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex justify-between">
          <Label>Category </Label>
          <Button
            size="icon"
            className="self-end"
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          ><Plus /></Button>

        </div>
        <div className="flex">
          <div className="flex-1 flex-wrap flex gap-2 max-h-[100px] overflow-auto">
            {value.map((item) => {
              return (
                <div key={item.slug} className="flex items-center border py-1 px-2 justify-between rounded-md gap-0.5">
                  <Label className="text-xs"> {item.name}   </Label>
                  <Button type="button" variant={"ghost"} className="size-2 p-0"
                    onClick={() => handleRemove(item, value)}
                  ><CircleX /></Button>
                </div>
              )
            })}
          </div>

        </div>
        <PopoverTrigger />
        <PopoverContent className="w-full p-0 ">
          <Command>
            <CommandInput placeholder="Search items..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty >
                <Button className="w-full" variant={"ghost"}
                  onClick={() => {
                    const name = normalizeCategoryName(inputValue)
                    handleSelect({
                      name: name,
                      slug: generateSlug(name),
                    }, value)
                  }}
                >
                  {`${inputValue} (New)`}

                </Button>
              </CommandEmpty>
              {items
                .filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()))
                .map((item) => (
                  <CommandItem
                    key={String(item.name)}
                    // value={String(item.value)}
                    onSelect={() => handleSelect(item, value)}
                  >
                    {item.name}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover >
    </>
  );
}
function normalizeCategoryName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function generateSlug(name: string): string {
  return name
      .toLowerCase()
      .normalize("NFD") // Chuẩn hóa Unicode để loại bỏ dấu
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
      .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, "-"); // Loại bỏ dấu gạch ngang thừa
}

export default SelectDropdown
