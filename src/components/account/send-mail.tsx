import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalFooter, FormErrorMessage,
} from '@chakra-ui/react'
import {useState} from "react";
import * as Yup from "yup";
import {ResponseType} from "../../types/response.type.ts";
import {resendMailAPI} from "../../services/auth.service.ts";
import ResetPassword from "./reset-password.tsx";
import VerifyEmail from "./verify.tsx";

interface Props {
  type: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const validationSchema =
  Yup.string().required('Email is required!').email('Invalid email!');

const SendMail = (props: Props) => {
  const {isOpen, setIsOpen, type} = props;
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState();
  const [isOpenPass, setIsOpenPass] = useState(false);
  const [isOpenVerify, setIsOpenVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail('');
    setError(undefined);
    setIsOpen(false);
  }

  const handleRequest = async () => {
    try {
      await validationSchema.validate(email);
      setError(undefined);
      setLoading(true);
      const res: ResponseType = await resendMailAPI({email, type});
      setLoading(false)
      if (res && !res.error) {
        if (type === 'reset-password') {
          setIsOpenPass(true);
        } else {
          setIsOpenVerify(true);
        }
        setIsOpen(false);
      } else {
        toast({
          title: res.error,
          description: Array.isArray(res.message) ? res.message[0] : res.message,
          status: 'error',
        })
      }
    } catch (validationError: Yup.ValidationError) {
      setError(validationError.message);
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={reset} closeOnOverlayClick={false} isCentered>
        <ModalOverlay/>
        <ModalContent mx={{base: 4}}>
          <Stack spacing={4} px={8} my={8}>
            <Heading lineHeight={1.1} size={{base: 'sm', md: 'md'}}>
              {type === 'password' ? 'Forgot your password' : 'Reactivate account'}
            </Heading>
            <Text
              fontSize={{base: 'sm', sm: 'md'}}
              color={useColorModeValue('gray.800', 'gray.400')}>
              You&apos;ll get an email with a OTP
            </Text>
            <FormControl isInvalid={error} isRequired>
              <Input
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          </Stack>
          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme={'blue'}
              variant={'solid'}
              onClick={handleRequest}
              type={'submit'}
              size={{base: 'sm', md: 'md'}}
            >
              Request
            </Button>
            <Button colorScheme='gray' ml={3} onClick={reset} size={{base: 'sm', md: 'md'}} disabled={loading}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ResetPassword isOpen={isOpenPass} setIsOpen={setIsOpenPass} email={email}/>
      <VerifyEmail isOpen={isOpenVerify} email={email} setIsOpen={setIsOpenVerify}/>
    </>
  )
}

export default SendMail