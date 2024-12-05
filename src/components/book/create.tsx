import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {createBookAPI} from "../../services/book.service.ts";
import Autocomplete from "../common/autocomplete.tsx";
import ImageUpload from "../common/upload.tsx";

interface Suggestion {
  label: string;
  value: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getBookList: () => void;
  authorList: Suggestion[];
  publisherList: Suggestion[];
  categoryList: Suggestion[];
}

interface FormValues {
  name: string;
  description: string;
  publishYear: number;
  quantity: number;
  authors: number[];
  categories: number[];
  publisherId: number;
  images: number[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!")
    .max(100, "Name must be less than 100 characters!"),
  description: Yup.string().required("Description is required!")
    .max(1000, "Description must be less than 1000 characters!"),
  publishYear: Yup.number().required("Publish year is required!")
    .min(1924, "Publish year is invalid!").max(2024, "Publish year is invalid!"),
  quantity: Yup.number().required("Quantity is required!")
    .min(1, "Quantity must be at least 1!"),
  authors: Yup.array().of(Yup.number().required("Each author must be a valid ID!"))
    .required("Authors are required!").min(1, "At least one author is required!"),
  categories: Yup.array().of(Yup.number().required("Each category must be a valid ID!"))
    .required("Categories are required!").min(1, "At least one category is required!"),
  images: Yup.array().of(Yup.number().required("Each image must be a valid ID!"))
    .required("Images are required!").min(1, "At least one image is required!"),
  publisherId: Yup.number().required("Publisher is required!").min(1, "Publisher is invalid!")
});


const CreateBook = (props: Props) => {
  const {isOpen, onClose, getBookList, authorList, publisherList, categoryList} = props;
  const initialValues: FormValues = {
    name: '',
    description: '',
    publishYear: 0,
    quantity: 0,
    authors: [],
    categories: [],
    images: [],
    publisherId: 0
  };
  const toast = useToast();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // const res: ResponseType = await createBookAPI(values);
    // actions.setSubmitting(false);
    // if (res && res.data) {
    //   toast({
    //     description: res.message,
    //     status: 'success',
    //   })
    //   onClose();
    //   await getBookList();
    // } else {
    //   toast({
    //     title: res.error,
    //     description: Array.isArray(res.message) ? res.message[0] : res.message,
    //     status: 'error',
    //   })
    // }
    console.log(values);
  }

  const handleUploadComplete = (ids: string[]) => {
    console.log("Uploaded IDs:", ids);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      closeOnOverlayClick={false}
      onClose={onClose}
      size={{base: 'full', md: 'md'}}
    >
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton/>
        <DrawerHeader>Create book</DrawerHeader>
        <DrawerBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({errors, touched, isSubmitting}) => (
              <Stack spacing={4} w={'full'} h={'full'}>
                <Form style={{height: '100%'}}>
                  <Flex h={'full'} direction={"column"} justify={'space-between'}>
                    <Stack spacing={4}>
                      <FormControl isInvalid={!!errors.name && touched.name} isRequired>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Field as={Input} id="name" name="name" type="text"/>
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.description && touched.description} isRequired>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Field as={Textarea} id="description" name="description"/>
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>
                      <HStack align={'start'}>
                        <FormControl isInvalid={!!errors.publishYear && touched.publishYear} isRequired>
                          <FormLabel htmlFor="publishYear">Publish year</FormLabel>
                          <Field name="publishYear">
                            {({field, form}) => (
                              <NumberInput {...field} min={1924} max={2024}
                                           onChange={value => form.setFieldValue(field.name, parseInt(value))}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                  <NumberIncrementStepper/>
                                  <NumberDecrementStepper/>
                                </NumberInputStepper>
                              </NumberInput>
                            )}
                          </Field>
                          <FormErrorMessage>{errors.publishYear}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.quantity && touched.quantity} isRequired>
                          <FormLabel htmlFor="quantity">Quantity</FormLabel>
                          <Field name="quantity">
                            {({field, form}) => (
                              <NumberInput {...field} min={1} max={1000}
                                           onChange={value => form.setFieldValue(field.name, parseInt(value))}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                  <NumberIncrementStepper/>
                                  <NumberDecrementStepper/>
                                </NumberInputStepper>
                              </NumberInput>
                            )}
                          </Field>
                          <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl isInvalid={!!errors.authors && touched.authors}>
                        <FormLabel htmlFor="authors">Authors <span style={{color: 'red'}}>*</span></FormLabel>
                        <Field name="authors">
                          {({ field, form }) => (
                            <Autocomplete
                              suggestions={authorList}
                              isMultiSelect
                              onSelect={(selected) => {
                                if (Array.isArray(selected)) {
                                  form.setFieldValue(field.name, selected.map((item) => item.value));
                                } else {
                                  form.setFieldValue(field.name, selected.value);
                                }
                              }}
                            />
                          )}
                        </Field>
                        <FormErrorMessage>{errors.authors}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.categories && touched.categories}>
                        <FormLabel htmlFor="categories">Categories <span style={{color: 'red'}}>*</span></FormLabel>
                        <Field name='categories'>
                          {({field, form}) => (
                            <Autocomplete
                              suggestions={categoryList}
                              isMultiSelect
                              onSelect={(selected) => {
                                if (Array.isArray(selected)) {
                                  form.setFieldValue(field.name, selected.map((item) => item.value));
                                } else {
                                  form.setFieldValue(field.name, selected.value);
                                }
                              }}
                            />
                          )}
                        </Field>
                        <FormErrorMessage>{errors.categories}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.publisherId && touched.publisherId}>
                        <FormLabel htmlFor="publisherId">Publisher <span style={{color: 'red'}}>*</span></FormLabel>
                        <Field name='publisherId'>
                          {({field, form}) => (
                            <Autocomplete
                              suggestions={publisherList}
                              onSelect={(selected) => {
                                if (!selected) {
                                  form.setFieldValue(field.name, null);
                                  return;
                                }
                                if (Array.isArray(selected)) {
                                  form.setFieldValue(field.name, selected.map((item) => item.value));
                                } else {
                                  form.setFieldValue(field.name, selected.value);
                                }
                              }}
                            />
                          )}
                        </Field>
                        <FormErrorMessage>{errors.publisherId}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.images && touched.images}>
                        <FormLabel htmlFor="images">Images <span style={{color: 'red'}}>*</span></FormLabel>
                        <Field name='images'>
                          {({field, form}) => (
                            <ImageUpload onUploadComplete={handleUploadComplete} />
                          )}
                        </Field>
                        <FormErrorMessage>{errors.images}</FormErrorMessage>
                      </FormControl>

                    </Stack>
                    <HStack justify='right' py={4}>
                      <Button variant='outline' onClick={onClose}>
                        Cancel
                      </Button>
                      <Button colorScheme='teal' type="submit" isLoading={isSubmitting}>
                        Save
                      </Button>
                    </HStack>
                  </Flex>
                </Form>
              </Stack>
            )}
          </Formik>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateBook