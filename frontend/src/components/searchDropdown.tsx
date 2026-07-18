import React from 'react';
import CreatableSelect from 'react-select/creatable';

interface SearchDropdownProps {
  placeholder: string;
  options: { value: string | number; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onSearchChange?: (value: string) => void;
  disabled?: boolean;
}

export default function SearchDropdown({ 
  placeholder, 
  options, 
  value, 
  onChange, 
  onSearchChange, 
  disabled = false 
}: SearchDropdownProps) {
  
  const handleChange = (newValue: any) => {
    onChange(newValue ? newValue.value : '');
  };

  const currentOption = options.find(opt => opt.value === value) || (value ? { value, label: value } : null);

  return (
    <div className='w-full text-black'>
      <CreatableSelect
        options={options}
        value={currentOption}
        onChange={handleChange}
        onInputChange={(inputValue, { action }) => {
          if (action === "input-change" && onSearchChange) {
            onSearchChange(inputValue);
          }
        }}
        isSearchable={true}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={true}
        className="w-full"
      />
    </div>
  );
}