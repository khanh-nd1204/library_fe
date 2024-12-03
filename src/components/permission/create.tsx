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
  Select,
} from "@chakra-ui/react";
import * as Yup from "yup";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {createPermissionAPI} from "../../services/permission.service.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getPermissionList: () => void;
}

interface FormValues {
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  apiPath: Yup.string().required("API path is required!").max(100, 'API path must be less than 100 characters!'),
  method: Yup.string().required("Method is required!").max(100, 'Method must be less than 100 characters!'),
  module: Yup.string().required("Module is required!").max(100, 'Module must be less than 100 characters!'),
})

const CreatePermission = (props: Props) => {
  const {isOpen, onClose, getPermissionList} = props;
  const initialValues: FormValues = {name: '', apiPath: '', method: '', module: ''};
  const toast = useToast();
  const methodList = ['POST', 'PATCH', 'GET', 'DELETE'];

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await createPermissionAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      await getPermissionList();
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
        <DrawerHeader>Create permission</DrawerHeader>
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
                      <FormControl isInvalid={!!errors.apiPath && touched.apiPath} isRequired>
                        <FormLabel htmlFor="apiPath">API path</FormLabel>
                        <Field as={Input} id="apiPath" name="apiPath" type="text"/>
                        <FormErrorMessage>{errors.apiPath}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.method && touched.method} isRequired>
                        <FormLabel htmlFor="method">Method</FormLabel>
                        <Field as={Select} id="method" name="method" placeholder='Select method'>
                          {methodList.map(item => <option key={item} value={item}>{item}</option>)}
                        </Field>
                        <FormErrorMessage>{errors.method}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.module && touched.module} isRequired>
                        <FormLabel htmlFor="module">Module</FormLabel>
                        <Field as={Input} id="module" name="module" type="text"/>
                        <FormErrorMessage>{errors.module}</FormErrorMessage>
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

export default CreatePermission