import {PropsWithChildren, ReactNode} from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Image,
} from '@chakra-ui/react'
import {FiHome, FiMenu, FiChevronDown, FiUsers,} from 'react-icons/fi'
import { IconType } from 'react-icons'
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {ResponseType} from "../../types/response.type.ts";
import {logoutUserAPI} from "../../services/auth.service.ts";
import {doLogoutAccountAction} from "../../redux/account/accountSlice.ts";
import logo from "../../../public/logo.png";

interface LinkItemProps {
  name: string,
  icon: IconType,
  href: string,
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: ReactNode
  selected: string
  href: string
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, href: '/admin' },
  { name: 'User', icon: FiUsers, href: '/admin/user' }
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image
          display={{ base: 'none', md: 'flex' }}
          boxSize={16}
          src={logo}
          alt={'Logo'}
        />
        <Text fontSize="xl" fontWeight="bold">
          Music App
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem selected={location.pathname} href={link.href} key={link.name} icon={link.icon} onClick={() => navigate(link.href)}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ selected, href, icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bgColor={selected === href ? 'blue.400' : 'none'}
      color={selected === href ? 'white' : 'none'}
      _hover={{
        bg: 'blue.400',
        color: 'white',
      }}
      {...rest}>
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const user = useSelector(state => state.account.user);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res: ResponseType = await logoutUserAPI();
    if (res && !res.error) {
      toast({
        description: res.message,
        status: 'success'
      });
      dispatch(doLogoutAccountAction());
      navigate('/login');
    } else {
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
        duration: 2000,
      })
    }
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Image
        display={{ base: 'flex', md: 'none' }}
        boxSize={16}
        src={logo}
        alt={'Logo'}
      />

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{user.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

const AdminLayout = (props: PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <MobileNav onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          <Box bgColor={'white'} borderRadius={8} p={4}>
            {props.children}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AdminLayout