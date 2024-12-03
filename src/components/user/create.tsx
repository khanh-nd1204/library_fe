import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay, FormControl, FormErrorMessage, FormLabel,
  Input, Stack, useToast, HStack, Flex, InputGroup, InputRightElement, IconButton
} from "@chakra-ui/react";
import * as Yup from "yup";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {createUserAPI} from "../../services/user.service.ts";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {useState} from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getUserList: () => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  email: Yup.string().required('Email is required!').email('Invalid email!'),
  password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!').max(50, 'Password must be less than 50 characters'),
  address: Yup.string().required("Address is required!").max(100, 'Address must be less than 100 characters!'),
  phone: Yup.string().required("Phone is required!").matches(/^\d{10}$/, 'Phone must be exactly 10 digits and numeric!'),
})

const CreateUser = (props: Props) => {
  const {isOpen, onClose, getUserList} = props;
  const initialValues: FormValues = {name: '', email: '', password: '', address: '', phone: ''};
  const toast = useToast();
  const [show, setShow] = useState(false);

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await createUserAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      await getUserList();
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
        <DrawerHeader>Create user</DrawerHeader>
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
                      <FormControl isInvalid={!!errors.password && touched.password} isRequired>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Field name='password'>
                          {({field, form}) => (
                            <InputGroup>
                              <Input
                                {...field}
                                type={show ? 'text' : 'password'}
                                onChange={e => form.setFieldValue(field.name, e.target.value)}
                              />
                              <InputRightElement>
                                <IconButton
                                  aria-label='Toggle password'
                                  size='sm'
                                  variant='ghost'
                                  icon={!show ? <ViewOffIcon/> : <ViewIcon/>}
                                  onClick={() => setShow(!show)}
                                />
                              </InputRightElement>
                            </InputGroup>
                          )}
                        </Field>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
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

export default CreateUser