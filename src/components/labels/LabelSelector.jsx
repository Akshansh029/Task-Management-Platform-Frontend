'use client';

import React from 'react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus, Tag as TagIcon, Check } from 'lucide-react';
import { useLabels } from '@/lib/hooks/useLabels';

const LabelSelector = ({ selectedLabelIds = [], onSelect, onRemove }) => {
  const { labels, isLoading } = useLabels();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 border-dashed">
          <Plus className="mr-2 h-3 w-3" />
          Add Label
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]" align="start">
        <Command>
          <CommandInput placeholder="Search labels..." />
          <CommandList>
            <CommandEmpty>No label found.</CommandEmpty>
            <CommandGroup>
              {labels.map((label) => {
                const isSelected = selectedLabelIds.includes(label.id);
                return (
                  <CommandItem
                    key={label.id}
                    onSelect={() => {
                      if (isSelected) {
                        onRemove(label.id);
                      } else {
                        onSelect(label.id);
                      }
                      // Close on select to feel snappy
                      // setOpen(false); 
                    }}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: label.color }} 
                      />
                      <span>{label.name}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LabelSelector;
