import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  useToast,
  ModalOverlay,
  ModalContent,
  Modal,
  FormErrorMessage,
  FormLabel,
  PinInput,
  PinInputField, HStack, InputGroup, InputRightElement, IconButton,
} from '@chakra-ui/react'
import * as Yup from "yup";
import {ResponseType} from "../../types/response.type.ts";
import {resetUserPasswordAPI} from "../../services/auth.service.ts";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {useState} from "react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  email: string;
}

interface FormValues {
  otp: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!').max(50, 'Password must be less than 50 characters'),
  otp: Yup.string().required('OTP is required').matches(/^\d{6}$/, 'OTP must be exactly 6 digits and numeric!')
})

const ResetPassword = (props: Props) => {
  const {isOpen, setIsOpen, email} = props;
  const initialValues: FormValues = {otp: '', password: ''};
  const toast = useToast();
  const [show, setShow] = useState(false);

  const reset = () => {
    setIsOpen(false);
  }

  const handleReset = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const data = {email, otp: parseInt(values.otp), password: values.password};
    const res: ResponseType = await resetUserPasswordAPI(data);
    actions.setSubmitting(false);
    if (res && !res.error) {
      toast({
        description: res.message,
        status: 'success',
      })
      setIsOpen(false);
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={reset} closeOnOverlayClick={false} isCentered>
      <ModalOverlay/>
      <ModalContent mx={{base: 4}}>
        <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleReset}
        >
          {({errors, touched, isSubmitting}) => (
            <Form>
              <Stack spacing={4} px={8} my={8}>
                <Heading lineHeight={1.1} size={{base: 'sm', md: 'md'}}>
                  Reset your password
                </Heading>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.otp && touched.otp} isRequired>
                    <FormLabel htmlFor="otp">OTP</FormLabel>
                    <HStack>
                      <Field name="otp">
                        {({field, form}) => (
                          <PinInput
                            otp
                            type="number"
                            {...field}
                            onChange={(value) => form.setFieldValue(field.name, value)}
                          >
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                            <PinInputField/>
                          </PinInput>
                        )}
                      </Field>
                    </HStack>
                    <FormErrorMessage>{errors.otp}</FormErrorMessage>
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
                  <Button
                    colorScheme={'blue'}
                    variant={'solid'}
                    type="submit"
                    isLoading={isSubmitting}
                    mt={4}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default ResetPassword