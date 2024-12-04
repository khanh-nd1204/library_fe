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
} from "@chakra-ui/react";
import * as Yup from "yup";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {createPublisherAPI} from "../../services/publisher.service.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getPublisherList: () => void;
}

interface FormValues {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  email: Yup.string().required('Email is required!').email('Invalid email!'),
  address: Yup.string().required("Address is required!").max(100, 'Address must be less than 100 characters!'),
  phone: Yup.string().required("Phone is required!").matches(/^\d{10}$/, 'Phone must be exactly 10 digits and numeric!'),
})

const CreatePublisher = (props: Props) => {
  const {isOpen, onClose, getPublisherList} = props;
  const initialValues: FormValues = {name: '', email: '', address: '', phone: ''};
  const toast = useToast();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await createPublisherAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      await getPublisherList();
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
        <DrawerHeader>Create publisher</DrawerHeader>
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
                      <FormControl isInvalid={!!errors.email && touched.email} isRequired>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Field as={Input} id="email" name="email" type="email"/>
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.address && touched.address} isRequired>
                        <FormLabel htmlFor="adress">Address</FormLabel>
                        <Field as={Input} id="address" name="address" type="text"/>
                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.phone && touched.phone} isRequired>
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <Field as={Input} id="phone" name="phone" type="text"/>
                        <FormErrorMessage>{errors.phone}</FormErrorMessage>
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

export default CreatePublisher