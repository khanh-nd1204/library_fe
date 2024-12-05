import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
  HStack,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import * as Yup from "yup";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {CategoryType} from "../../types/category.type.ts";
import {updateCategoryAPI} from "../../services/category.service.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getCategoryList: () => void;
  dataSelected: CategoryType
}

interface FormValues {
  id: number;
  name: string;
  description: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  description: Yup.string().max(100, 'Description must be less than 100 characters!'),
})

const UpdateCategory = (props: Props) => {
  const {isOpen, onClose, getCategoryList, dataSelected} = props;
  const initialValues: FormValues = {
    id: dataSelected.id ?? null,
    name: dataSelected.name ?? '',
    description: dataSelected.description ?? ''
  };
  const toast = useToast();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await updateCategoryAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      await getCategoryList();
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
      })
    }
  }

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
        <DrawerHeader>Update category</DrawerHeader>
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
                      <FormControl isInvalid={!!errors.description && touched.description}>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Field as={Textarea} id="description" name="description" type="text"/>
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>
                    </Stack>
                    <HStack justify='right'>
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

export default UpdateCategory