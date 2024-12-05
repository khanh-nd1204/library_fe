import React, { useState } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  ListIcon,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { SearchIcon, CheckIcon } from "@chakra-ui/icons";

interface Suggestion {
  label: string; // Text hiển thị
  value: number; // Giá trị duy nhất
}

interface AutocompleteProps {
  suggestions: Suggestion[]; // Danh sách gợi ý
  placeholder?: string; // Placeholder input
  isMultiSelect?: boolean; // Cho phép chọn nhiều giá trị
  onSelect?: (selected: Suggestion | Suggestion[] | null) => void; // Callback khi thay đổi selected
}

const Autocomplete: React.FC<AutocompleteProps> = ({
                                                     suggestions,
                                                     placeholder = "Search and select",
                                                     isMultiSelect = false,
                                                     onSelect,
                                                   }) => {
  const [inputValue, setInputValue] = useState<string>(""); // Giá trị input
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    []
  ); // Danh sách gợi ý
  const [selectedOptions, setSelectedOptions] = useState<Suggestion[]>([]); // Các item đã chọn
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false); // Hiển thị dropdown

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!isMultiSelect && value.trim() === "") {
      // Nếu là simple select và input trống, xóa selectedOptions
      setSelectedOptions([]);
      if (onSelect) onSelect(null); // Gọi callback với giá trị null
    }

    if (value.trim()) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions); // Hiển thị toàn bộ nếu input trống
    }
    setDropdownVisible(true);
  };

  const handleInputFocus = () => {
    if (!inputValue.trim()) {
      setFilteredSuggestions(suggestions);
    }
    setDropdownVisible(true);
  };

  const handleSuggestionClick = (suggestion: Suggestion | null) => {
    if (!suggestion) return; // Đảm bảo suggestion không null

    if (isMultiSelect) {
      const alreadySelected = selectedOptions.some(
        (option) => option?.value === suggestion.value // Kiểm tra kỹ option trước khi truy cập value
      );
      const updatedSelection = alreadySelected
        ? selectedOptions.filter((option) => option?.value !== suggestion.value)
        : [...selectedOptions, suggestion];

      setSelectedOptions(updatedSelection);
      if (onSelect) onSelect(updatedSelection);
    } else {
      setSelectedOptions([suggestion]);
      setInputValue(suggestion.label);
      if (onSelect) onSelect(suggestion);
    }
  };


  const handleRemoveOption = (value: number) => {
    if (!isMultiSelect) return; // Chỉ xử lý khi là multi-select
    const updatedSelection = selectedOptions.filter(
      (option) => option?.value !== value // Kiểm tra option trước khi truy cập value
    );
    setSelectedOptions(updatedSelection);
    if (onSelect) onSelect(updatedSelection);
  };


  return (
    <Box position="relative" width={"100%"}>
      {isMultiSelect && (
        <Flex wrap="wrap" mb="2">
          {selectedOptions.map((option) => (
            <Tag
              key={option.value}
              borderRadius="full"
              variant="solid"
              colorScheme="teal"
              m="1"
            >
              <TagLabel>{option.label}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveOption(option.value)} />
            </Tag>
          ))}
        </Flex>
      )}

      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
      />

      {isDropdownVisible && (
        <List
          position="absolute"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          mt="2"
          w="full"
          zIndex="10"
          maxH="150px"
          overflowY="auto"
        >
          {filteredSuggestions.length ? (
            filteredSuggestions.map((suggestion) => {
              const isSelected = selectedOptions.some(
                (option) => option.value === suggestion.value
              );
              return (
                <ListItem
                  key={suggestion.value}
                  px="4"
                  py="2"
                  cursor="pointer"
                  bg={isSelected ? "gray.100" : "white"}
                  _hover={{ bg: isSelected ? "gray.200" : "gray.100" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Flex align="center">
                    <ListIcon
                      as={isSelected ? CheckIcon : SearchIcon}
                      color={isSelected ? "gray.300" : "gray.200"}
                    />
                    {suggestion.label}
                  </Flex>
                </ListItem>
              );
            })
          ) : (
            <ListItem px="4" py="2" color="gray.500">
              Not found result
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
};

export default Autocomplete;
