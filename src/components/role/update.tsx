import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel, Badge,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ResponseType} from "../../types/response.type.ts";
import {updateRoleAPI} from "../../services/role.service.ts";
import {RoleType} from "../../types/role.type.ts";
import {PermissionType} from "../../types/permission.type.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataSelected: RoleType;
  getRoleList: () => void;
  permissionList: [{module: string, api: PermissionType[]}];
}

interface FormValues {
  id: number;
  name: string;
  description: string;
  permissions: number[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!").max(100, 'Name must be less than 100 characters!'),
  description: Yup.string().required("Description is required!").max(100, 'Description must be less than 100 characters!'),
  permissions: Yup.array().of(Yup.number()).required("Permissions are required!").min(1, "At least one permissions are required!"),
})

const UpdateRole = (props: Props) => {
  const {isOpen, onClose, dataSelected, getRoleList, permissionList} = props;
  const initialValues: FormValues = {
    id: dataSelected.id ?? null,
    name: dataSelected.name ?? '',
    description: dataSelected.description ?? '',
    permissions: dataSelected.permissions ?? []
  };
  const toast = useToast();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const res: ResponseType = await updateRoleAPI(values);
    actions.setSubmitting(false);
    if (res && res.data) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      await getRoleList();
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
        <DrawerHeader>Create role</DrawerHeader>
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
                      <FormControl isInvalid={!!errors.description && touched.description} isRequired>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Field as={Input} id="description" name="description" type="text"/>
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.permissions && touched.permissions}>
                        <FormLabel htmlFor="permissions">Permissions <span style={{color: 'red'}}>*</span></FormLabel>
                        <Field name="permissions">
                          {({field, form}) => (
                            <Accordion allowToggle>
                              {permissionList.map((module) => {
                                const isAllSelected = module.api.every((api) =>
                                  field.value.includes(api.id)
                                );
                                const isSomeSelected =
                                  module.api.some((api) => field.value.includes(api.id)) &&
                                  !isAllSelected;

                                return (
                                  <AccordionItem key={module.module}>
                                    <AccordionButton>
                                      <HStack flex="1" textAlign="left" justify="space-between">
                                        <Box>{module.module}</Box>
                                        <Checkbox
                                          isChecked={isAllSelected}
                                          isIndeterminate={isSomeSelected}
                                          colorScheme="teal"
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const currentPermissions = [...field.value];
                                            const moduleApiIds = module.api.map((api) => api.id);

                                            if (isChecked) {
                                              // Add all child API IDs for this module
                                              form.setFieldValue(field.name, [
                                                ...currentPermissions,
                                                ...moduleApiIds.filter((id) => !currentPermissions.includes(id)),
                                              ]);
                                            } else {
                                              // Remove all child API IDs for this module
                                              form.setFieldValue(
                                                field.name,
                                                currentPermissions.filter((id) => !moduleApiIds.includes(id))
                                              );
                                            }
                                          }}
                                        />
                                      </HStack>
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                      {module.api.map((api) => (
                                        <HStack key={api.id} justify="space-between" py={2}>
                                          <Box>{api.name}
                                            {api.method === 'GET' && <Badge ml='1' colorScheme='green'>{api.method}</Badge>}
                                            {api.method === 'POST' && <Badge ml='1' colorScheme='yellow'>{api.method}</Badge>}
                                            {api.method === 'PATCH' && <Badge ml='1' colorScheme='purple'>{api.method}</Badge>}
                                            {api.method === 'DELETE' && <Badge ml='1' colorScheme='red'>{api.method}</Badge>}
                                          </Box>
                                          <Checkbox
                                            colorScheme="teal"
                                            isChecked={field.value.includes(api.id)}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;
                                              const currentPermissions = [...field.value];

                                              if (isChecked) {
                                                // Add this API ID to permissions
                                                form.setFieldValue(field.name, [
                                                  ...currentPermissions,
                                                  api.id,
                                                ]);
                                              } else {
                                                // Remove this API ID from permissions
                                                form.setFieldValue(
                                                  field.name,
                                                  currentPermissions.filter((id) => id !== api.id)
                                                );
                                              }
                                            }}
                                          />
                                        </HStack>
                                      ))}
                                    </AccordionPanel>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>
                          )}
                        </Field>
                        <FormErrorMessage>{errors.permissions}</FormErrorMessage>
                      </FormControl>
                    </Stack>
                    <HStack justify='right' py={4}>
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

export default UpdateRole