import {Heading, Image, Stack, Text} from "@chakra-ui/react";
import logo from "../../../public/logo.png";

const ErrorPage = () => {
  return (
    <Stack minHeight="100vh" align={'center'} justify={'center'} spacing={2}>
      <Image
        boxSize={40}
        src={logo}
        alt={'Logo'}
      />
      <Heading size={'lg'}>404. Page not found!</Heading>
      <Text>The page you are looking for does not exist.</Text>
    </Stack>
  )
}

export default ErrorPage