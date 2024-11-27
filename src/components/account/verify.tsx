import {Center, FormErrorMessage, Heading, Modal, ModalContent, ModalOverlay, useToast} from '@chakra-ui/react'
import {
  Button,
  FormControl,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';
import {useState} from "react";
import {ResponseType} from "../../types/response.type.ts";
import {activateUserAPI} from "../../services/auth.service.ts";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";

interface Props {
  isOpen: boolean;
  email: string;
  setIsOpen: (isOpen: boolean) => void;
}

const validationSchema =
  Yup.string().required('OTP is required').matches(/^\d{6}$/, 'OTP must be exactly 6 digits and numeric!')

const VerifyEmail = (props: Props) => {
  const {isOpen, email, setIsOpen} = props;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await validationSchema.validate(otp);
      setError(undefined);
      const res: ResponseType = await activateUserAPI({email, otp: parseInt(otp)});
      if (res && !res.error) {
        toast({
          description: res.message,
          status: 'success',
        })
        setIsOpen(false);
        navigate('/login');
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
  };

  const reset = () => {
    setOtp('');
    setIsOpen(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={reset} closeOnOverlayClick={false} isCentered>
      <ModalOverlay/>
      <ModalContent mx={{ base: 4 }}>
        <Stack spacing={4} px={8} my={8}>
          <Heading lineHeight={1.1} size={{ base: 'lg', md: 'xl' }} textAlign={'center'}>
            Verify your Email
          </Heading>
          <Center
            fontSize={{ base: 'sm', sm: 'md' }}
            color={useColorModeValue('gray.800', 'gray.400')}>
            We have sent code to your email
          </Center>
          <Center
            fontSize={{ base: 'sm', sm: 'md' }}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'gray.400')}>
            {email}
          </Center>
          <FormControl isInvalid={error} isRequired>
            <HStack justify={'center'}>
              <PinInput otp type="number" onChange={(value) => setOtp(value)}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            <Center>
              <FormErrorMessage>{error}</FormErrorMessage>
            </Center>
          </FormControl>
          <Stack spacing={6}>
            <Button
              colorScheme={'blue'}
              variant={'solid'}
              onClick={handleVerify}
              type={'submit'}
            >
              Verify
            </Button>
          </Stack>
        </Stack>
      </ModalContent>
    </Modal>
  )
}

export default VerifyEmail