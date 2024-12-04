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
import {AuthorType} from "../../types/author.type.ts";
import {updateAuthorAPI} from "../../services/author.service.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getAuthorList: () => void;
  dataSelected: AuthorType
}

interface FormValues {
  id: number;
  name: string;
  nationality: string;
  penName: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  nationality: Yup.string().required("Nationality is required!").max(100, 'Nationality must be less than 100 characters!'),
  penName: Yup.string().max(100, 'Date of death must be less than 100 characters!'),
})

const UpdateAuthor = (props: Props) => {
  const {isOpen, onClose, getAuthorList, dataSelected} = props;
  const initialValues: FormValues = {
    id: dataSelected.id ?? null,
    name: dataSelected.name ?? '',
    nationality: dataSelected.nationality ?? '',
    penName: dataSelected.penName ?? ''
  };
  const toast = useToast();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await updateAuthorAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      await getAuthorList();
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
        <DrawerHeader>Update author</DrawerHeader>
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
                      <FormControl isInvalid={!!errors.nationality && touched.nationality} isRequired>
                        <FormLabel htmlFor="nationality">Nationality</FormLabel>
                        <Field as={Input} id="nationality" name="nationality" type="text"/>
                        <FormErrorMessage>{errors.nationality}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.penName && touched.penName}>
                        <FormLabel htmlFor="penName">Pen name</FormLabel>
                        <Field as={Input} id="penName" name="penName" type="text"/>
                        <FormErrorMessage>{errors.penName}</FormErrorMessage>
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

export default UpdateAuthor