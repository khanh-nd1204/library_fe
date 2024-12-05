import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  VStack,
  HStack,
  IconButton,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";

interface UploadedImage {
  id: string;
  url: string;
}

interface ImageUploadProps {
  onUploadComplete?: (ids: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);
  const toast = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    try {
      const newImages: UploadedImage[] = files.map((file) => {
        const id = file.name;
        const url = URL.createObjectURL(file);
        return { id, url };
      });

      setImages((prev) => [...prev, ...newImages]);
      setUploadedIds((prev) => [...prev, ...newImages.map((img) => img.id)]);
      toast({ title: "Upload success!", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Upload fail!", status: "error", duration: 2000 });
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setUploadedIds((prev) => prev.filter((uploadedId) => uploadedId !== id));
  };

  const handleComplete = () => {
    if (onUploadComplete) onUploadComplete(uploadedIds);
    toast({ title: "Upload completed!", status: "info", duration: 2000 });
  };

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      maxW="100%"
      mx="auto"
    >
      <VStack spacing={6} align="stretch">
        <Flex justify="center" align="center" direction="column">
          <Input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            display="none"
            onChange={handleUpload}
          />
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            Upload
          </Button>
        </Flex>

        <Box>
          <HStack wrap="wrap" spacing={4} justify="flex-start">
            {images.map((image) => (
              <Box
                key={image.id}
                position="relative"
                borderWidth={1}
                borderRadius="lg"
                overflow="hidden"
                boxSize="80px"
                boxShadow="sm"
                bg="gray.50"
              >
                <Image
                  src={image.url}
                  alt={`uploaded-${image.id}`}
                  boxSize="full"
                  objectFit="cover"
                />
                <IconButton
                  size="xs"
                  position="absolute"
                  top="5px"
                  right="5px"
                  colorScheme="red"
                  icon={<CloseIcon />}
                  onClick={() => handleRemoveImage(image.id)}
                  aria-label={`Remove ${image.id}`}
                />
              </Box>
            ))}
          </HStack>
        </Box>

        {images.length > 0 && (
          <Button colorScheme="teal" onClick={handleComplete} width="full">
            Complete ({images.length})
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ImageUpload;
