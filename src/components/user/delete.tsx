import {
  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast
} from "@chakra-ui/react";
import {UserType} from "../../types/user.type.ts";
import {ResponseType} from "../../types/response.type.ts";
import {deleteUserAPI} from "../../services/user.service.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataSelected: UserType;
  getUserList: () => void;
  setPage: (page: number) => void;
}

const DeleteUser = (props: Props) => {
  const {dataSelected, onClose, isOpen, getUserList, setPage} = props;
  const toast = useToast();

  const handleDelete = async () => {
    const res: ResponseType = await deleteUserAPI(dataSelected.id);
    if (res && !res.error) {
      toast({
        description: res.message,
        status: 'success',
      })
      onClose();
      setPage(1);
      getUserList();
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
          Are you sure you want to delete user <span style={{color: 'teal', fontWeight: 500}}>{dataSelected.name}</span>?
        </ModalBody>
        <ModalFooter>
          <Button variant='outline' onClick={onClose} mr={3}>Cancel</Button>
          <Button colorScheme='red' mr={3} onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteUser
