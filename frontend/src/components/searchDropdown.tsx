import React from 'react';
import CreatableSelect from 'react-select/creatable';

interface SearchDropdownProps {
  placeholder: string;
  options: { value: string | number; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SearchDropdown({placeholder, options, onChange, disabled = false }: SearchDropdownProps) {
  
  const handleChange = (newValue: any) => {
    onChange(newValue ? newValue.value : '');
  };

  return (
    <div className='w-full'>
      <CreatableSelect
        options={options}
        onChange={handleChange}
        isSearchable={true}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={true}
        className="w-full"
      />
    </div>
  );
}