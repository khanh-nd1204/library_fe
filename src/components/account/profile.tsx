import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast
} from "@chakra-ui/react";
import * as Yup from "yup";
import {UserType} from "../../types/user.type.ts";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {changeUserPasswordAPI, updateUserAPI} from "../../services/user.service.ts";
import {doUpdateAccountAction} from "../../redux/account/accountSlice.ts";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

interface Props {
  data: UserType,
  isOpen: boolean;
  onClose: () => void;
}

interface EditFormValues {
  id: number;
  name: string;
  address: string;
  phone: string;
}

const validationEditSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  address: Yup.string().required("Address is required!").max(100, 'Address must be less than 100 characters!'),
  phone: Yup.string().required("Phone is required!").matches(/^\d{10}$/, 'Phone must be exactly 10 digits and numeric!'),
})

interface PasswordFormValues {
  id: number;
  currentPassword: string;
  newPassword: string;
}

const validationPasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required!').min(6, 'Password must be at least 6 characters!').max(50, 'Current password must be less than 50 characters'),
  newPassword: Yup.string().required('New password is required!').min(6, 'Password must be at least 6 characters!').max(50, 'New password must be less than 50 characters'),
})


const Profile = (props: Props) => {
  const {data, onClose, isOpen} = props;
  const toast = useToast();
  const dispatch = useDispatch();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const initialEditValues: EditFormValues = {
    id: data.id ?? null,
    name: data.name ?? '',
    address: data.address ?? '',
    phone: data.phone ?? ''
  };

  const initialPasswordValues: PasswordFormValues = {
    id: data.id ?? null,
    currentPassword: '',
    newPassword: '',
  };

  const handleEdit = async (values: EditFormValues, actions: FormikHelpers<EditFormValues>) => {
    const res: ResponseType = await updateUserAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      dispatch(doUpdateAccountAction(res.data));
      onClose();
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
      })
    }
  }

  const handleChangePassword = async (values: PasswordFormValues, actions: FormikHelpers<PasswordFormValues>) => {
    const res: ResponseType = await changeUserPasswordAPI(values);
    actions.setSubmitting(false);
    if (res && !res.error) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
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
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered size='lg'>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>User Profile</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Tabs isFitted colorScheme="teal">
              <TabList>
                <Tab>Edit info</Tab>
                <Tab>Change password</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Formik
                    initialValues={initialEditValues}
                    validationSchema={validationEditSchema}
                    onSubmit={handleEdit}
                  >
                    {({errors, touched, isSubmitting}) => (
                      <Stack spacing={4} w={'full'} h={'full'}>
                        <Form style={{height: '100%'}}>
                          <Flex h={'full'} direction={"column"} justify={'space-between'}>
                            <Stack spacing={4}>
                              <FormControl isDisabled>
                                <FormLabel htmlFor="email1">Email</FormLabel>
                                <Input id="email1" name="email1" type="email" value={data.email}/>
                              </FormControl>
                              <FormControl isInvalid={!!errors.name && touched.name} isRequired>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Field as={Input} id="name" name="name" type="text"/>
                                <FormErrorMessage>{errors.name}</FormErrorMessage>
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
                            <HStack justify='right' mt={4}>
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
                </TabPanel>

                <TabPanel>
                  <Formik
                    initialValues={initialPasswordValues}
                    validationSchema={validationPasswordSchema}
                    onSubmit={handleChangePassword}
                  >
                    {({errors, touched, isSubmitting}) => (
                      <Stack spacing={4} w={'full'} h={'full'}>
                        <Form style={{height: '100%'}}>
                          <Flex h={'full'} direction={"column"} justify={'space-between'}>
                            <Stack spacing={4}>
                              <FormControl isDisabled>
                                <FormLabel htmlFor="email2">Email</FormLabel>
                                <Input id="email2" name="email2" type="email" value={data.email}/>
                              </FormControl>
                              <FormControl isInvalid={!!errors.currentPassword && touched.currentPassword} isRequired>
                                <FormLabel htmlFor="currentPassword">Current password</FormLabel>
                                <Field name='currentPassword'>
                                  {({field, form}) => (
                                    <InputGroup>
                                      <Input
                                        {...field}
                                        type={showCurrent ? 'text' : 'password'}
                                        onChange={e => form.setFieldValue(field.name, e.target.value)}
                                      />
                                      <InputRightElement>
                                        <IconButton
                                          aria-label='Toggle password'
                                          size='sm'
                                          variant='ghost'
                                          icon={!showCurrent ? <ViewOffIcon/> : <ViewIcon/>}
                                          onClick={() => setShowCurrent(!showCurrent)}
                                        />
                                      </InputRightElement>
                                    </InputGroup>
                                  )}
                                </Field>
                                <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                              </FormControl>
                              <FormControl isInvalid={!!errors.newPassword && touched.newPassword} isRequired>
                                <FormLabel htmlFor="newPassword">New password</FormLabel>
                                <Field name='newPassword'>
                                  {({field, form}) => (
                                    <InputGroup>
                                      <Input
                                        {...field}
                                        type={showNew ? 'text' : 'password'}
                                        onChange={e => form.setFieldValue(field.name, e.target.value)}
                                      />
                                      <InputRightElement>
                                        <IconButton
                                          aria-label='Toggle password'
                                          size='sm'
                                          variant='ghost'
                                          icon={!showNew ? <ViewOffIcon/> : <ViewIcon/>}
                                          onClick={() => setShowNew(!showNew)}
                                        />
                                      </InputRightElement>
                                    </InputGroup>
                                  )}
                                </Field>
                                <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                              </FormControl>
                            </Stack>
                            <HStack justify='right' mt={4}>
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
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Profile