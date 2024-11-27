import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Text,
  FormErrorMessage,
  Link,
  useToast, InputGroup, InputRightElement, IconButton
} from "@chakra-ui/react";
import * as Yup from 'yup';
import {Field, Form, Formik, FormikHelpers} from "formik";
import logo from "../../../public/logo.png";
import registerBg from "../../../public/register-bg.jpg";
import {registerUserAPI} from "../../services/auth.service.ts";
import {ResponseType} from "../../types/response.type.ts";
import VerifyEmail from "../../components/account/verify.tsx";
import {useState} from "react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

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
  password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!').max(50, 'Name must be less than 50 characters'),
  address: Yup.string().required("Address is required!").max(100, 'Address must be less than 100 characters!'),
  phone: Yup.string().required("Phone is required!").matches(/^\d{10}$/, 'Phone must be exactly 10 digits and numeric!'),
})

const RegisterPage = () => {
  const initialValues: FormValues = { name: '', email: '', password: '', address: '', phone: '' };
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await registerUserAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      setIsOpen(true);
      setEmail(values.email);
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
      })
    }
  }

  return (
    <>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Stack spacing={4} w={'full'} maxW={'md'}>
                <Form>
                  <Stack align={'center'}>
                    <Heading size={'lg'}>Get Started!</Heading>
                    <Image
                      boxSize={24}
                      src={logo}
                      alt={'Logo'}
                    />
                  </Stack>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.name && touched.name} isRequired>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Field as={Input} id="name" name="name" type="text" />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email && touched.email} isRequired>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Field as={Input} id="email" name="email" type="email" />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password && touched.password} isRequired>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Field name='password'>
                        {({ field, form }) => (
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
                      <Field as={Input} id="address" name="address" type="text" />
                      <FormErrorMessage>{errors.address}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.phone && touched.phone} isRequired>
                      <FormLabel htmlFor="phone">Phone</FormLabel>
                      <Field as={Input} id="phone" name="phone" type="text" />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>
                  </Stack>
                  <Button
                    colorScheme={'blue'}
                    variant={'solid'}
                    type="submit"
                    isLoading={isSubmitting}
                    mt={8}
                    w={'full'}
                  >
                    Register
                  </Button>
                  <Stack pt={6}>
                    <Text align={'center'}>
                      Already a user? <Link color={'blue.400'} href={'/login'}>Login</Link>
                    </Text>
                  </Stack>
                </Form>
              </Stack>
            )}
          </Formik>
        </Flex>
        <Flex flex={1} display={{ base: 'none', md: 'flex' }}>
          <Image
            alt={'Register Image'}
            objectFit={'cover'}
            src={registerBg}
          />
        </Flex>
      </Stack>
      <VerifyEmail isOpen={isOpen} email={email} setIsOpen={setIsOpen}/>
    </>
  )
}

export default RegisterPage