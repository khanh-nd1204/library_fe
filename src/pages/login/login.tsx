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
  useToast,
  InputRightElement,
  InputGroup,
  IconButton
} from "@chakra-ui/react";
import * as Yup from 'yup';
import {Field, Form, Formik, FormikHelpers} from "formik";
import logo from "../../../public/logo.png";
import loginBg from "../../../public/login-bg.jpg";
import {loginUserAPI} from "../../services/auth.service.ts";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {doLoginAccountAction} from "../../redux/account/accountSlice.ts";
import {ResponseType} from "../../types/response.type.ts";
import {useState} from "react";
import SendMail from "../../components/account/send-mail.tsx";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

interface FormValues {
  username: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Email is required!').email('Invalid email!'),
  password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!').max(50, 'Name must be less than 50 characters'),
})

const LoginPage = () => {
  const initialValues: FormValues = { username: '', password: '' };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('');
  const [show, setShow] = useState(false)

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await loginUserAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      dispatch(doLoginAccountAction(res.data));
      if (res.data.user && res.data.user.role === 'ADMIN') {
        console.log(res.data.user.role);
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
        duration: 2000,
      })
      if (res.statusCode === 401) reactivateAccount();
    }
  }

  const resetPassword = () => {
    setIsOpen(true);
    setType('reset-password');
  }

  const reactivateAccount = () => {
    setIsOpen(true);
    setType('activate-account');
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
                    <Heading size={'lg'}>Welcome!</Heading>
                    <Image
                      boxSize={24}
                      src={logo}
                      alt={'Logo'}
                    />
                  </Stack>

                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.username && touched.username} isRequired>
                      <FormLabel htmlFor="username">Email</FormLabel>
                      <Field as={Input} id="username" name="username" type="email" />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
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

                  </Stack>

                  <Stack spacing={4} mt={4}>
                    <Button colorScheme={'blue'} fontWeight={'normal'} variant={'link'} ml={'auto'}
                            onClick={resetPassword}>
                      Forgot password?
                    </Button>
                    <Button
                      colorScheme={'blue'}
                      variant={'solid'}
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Login
                    </Button>
                  </Stack>

                  <Stack mt={4}>
                    <Text align={'center'}>
                      Don't have an account? <Link color={'blue.400'} href={'/register'}>Register</Link>
                    </Text>
                  </Stack>
                </Form>
              </Stack>
            )}
          </Formik>
        </Flex>
        <Flex flex={1} display={{ base: 'none', md: 'flex' }}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={loginBg}
          />
        </Flex>
      </Stack>
      <SendMail isOpen={isOpen} setIsOpen={setIsOpen} type={type}/>
    </>
  )
}

export default LoginPage