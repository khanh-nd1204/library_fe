import React, {useState} from "react";
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
import {CloseIcon, AddIcon} from "@chakra-ui/icons";
import {ResponseType} from "../../types/response.type.ts";
import {uploadFileAPI} from "../../services/file.service.ts";

interface UploadedImage {
  id: number;
  url: string;
}

interface ImageUploadProps {
  onUploadComplete?: (ids: number[]) => void;
  folder: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({onUploadComplete, folder}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadedIds, setUploadedIds] = useState<number[]>([]);
  const [completeVisiable, setCompleteVisiable] = useState<boolean>(false);
  const toast = useToast();

  const uploadFile = async (file: File, folder: string): Promise<UploadedImage | null> => {
    const res: ResponseType = await uploadFileAPI(file, folder);
    if (res && res.data) {
      return {id: res.data.id, url: res.data.imageUrl};
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: "error",
      });
      return null;
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    if (images.length + files.length > 8) {
      toast({
        title: "Image limit reached!",
        description: "You can only upload a maximum of 8 images.",
        status: "warning",
      });
      return;
    }

    try {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"]; // Allowed image types

      // Filter valid files
      const validFiles = files.filter((file) => {
        if (!validImageTypes.includes(file.type)) {
          toast({
            title: "Invalid file type!",
            description: "Only JPEG, PNG, and JPG images are allowed.",
            status: "warning",
          });
          return false;
        }
        if (file.size > maxSize) {
          toast({
            title: `File ${file.name} exceeds 2MB limit.`,
            status: "warning",
          });
          return false;
        }
        return true;
      });

      if (!validFiles.length) return;

      const uploadedImages = await Promise.all(
        validFiles.map(async (file) => {
          const uploadedImage = await uploadFile(file, folder);
          return uploadedImage;
        })
      );

      const successfulUploads = uploadedImages.filter((img): img is UploadedImage => img !== null);
      setImages((prev) => [...prev, ...successfulUploads]);
      setUploadedIds((prev) => [...prev, ...successfulUploads.map((img) => img.id)]);
      setCompleteVisiable(true);
      toast({ title: "Upload success!", status: "success" });
    } catch (error) {
      console.error(error);
    }
  };


  const handleRemoveImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setUploadedIds((prev) => prev.filter((uploadedId) => uploadedId !== id));
    setCompleteVisiable(true);
  };

  const handleComplete = () => {
    if (onUploadComplete) onUploadComplete(uploadedIds);
    setCompleteVisiable(false);
    toast({ title: "Upload completed!", status: "info"});
  };

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      bg="white"
      maxW="100%"
      mx="auto"
    >
      <VStack spacing={4} align="stretch">
        <Flex justify="center" align="center" direction="column">
          <Input
            id="file-input"
            type="file"
            multiple
            accept="image/jpeg, image/png, image/jpg"
            display="none"
            onChange={handleUpload}
          />
          <Button
            leftIcon={<AddIcon/>}
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
                bg="gray.50"
              >
                <Image
                  src={import.meta.env.VITE_BACKEND_URL + image.url}
                  alt={`uploaded-${image.id}`}
                  boxSize="full"
                  objectFit="cover"
                  onClick={() => window.open(import.meta.env.VITE_BACKEND_URL + image.url, '_blank', 'noopener,noreferrer')}
                  cursor="pointer"
                />
                <IconButton
                  size="xs"
                  position="absolute"
                  top="5px"
                  right="5px"
                  colorScheme="red"
                  borderRadius="full"
                  icon={<CloseIcon/>}
                  onClick={() => handleRemoveImage(image.id)}
                  aria-label={`Remove ${image.id}`}
                />
              </Box>
            ))}
          </HStack>
        </Box>

        {completeVisiable && (
          <Button colorScheme="teal" onClick={handleComplete} width="full">
            Complete ({images.length})
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ImageUpload;
