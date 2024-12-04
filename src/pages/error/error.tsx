import {Button, Heading, Image, Stack, Text} from "@chakra-ui/react";
import logo from "../../../public/logo.png";
import {useNavigate} from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Stack minHeight="100vh" align={'center'} justify={'center'} spacing={2}>
      <Image
        boxSize={40}
        src={logo}
        alt={'Logo'}
      />
      <Heading size={'lg'}>404. Page not found!</Heading>
      <Text mb={4}>The page you are looking for does not exist.</Text>
      <Button
        colorScheme="teal"
        variant="solid"
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Stack>
  )
}

export default ErrorPage