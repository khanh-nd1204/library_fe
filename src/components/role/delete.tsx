import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast
} from "@chakra-ui/react";
import {ResponseType} from "../../types/response.type.ts";
import {deleteRoleAPI} from "../../services/role.service.ts";
import {RoleType} from "../../types/role.type.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataSelected: RoleType;
  getRoleList: () => void;
  setPage: (page: number) => void;
}

const DeleteRole = (props: Props) => {
  const {dataSelected, onClose, isOpen, getRoleList, setPage} = props;
  const toast = useToast();

  const deleteRole = async () => {
    const res: ResponseType = await deleteRoleAPI(dataSelected.id);
    if (res && !res.error) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      setPage(1);
      getRoleList();
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          Are you sure you want to delete role <span
          style={{color: 'teal', fontWeight: 500}}>{dataSelected.name}</span>?
        </ModalBody>
        <ModalFooter>
          <Button variant='outline' onClick={onClose} mr={3}>Cancel</Button>
          <Button colorScheme='red' mr={3} onClick={deleteRole}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteRole
