import {PropsWithChildren, ReactNode, useEffect, useState} from "react";
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
  Avatar,
} from '@chakra-ui/react'
import {FiHome, FiMenu, FiChevronDown, FiUsers,} from 'react-icons/fi'
import {IconType} from 'react-icons'
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {ResponseType} from "../../types/response.type.ts";
import {logoutUserAPI} from "../../services/auth.service.ts";
import {doLogoutAccountAction} from "../../redux/account/accountSlice.ts";
import logo from "../../../public/logo.png";
import Profile from "../account/profile.tsx";
import {getUserAPI} from "../../services/user.service.ts";
import {UserType} from "../../types/user.type.ts";

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
  {name: 'Dashboard', icon: FiHome, href: '/admin'},
  {name: 'User', icon: FiUsers, href: '/admin/user'}
]

const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{base: 'full', md: 60}}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image
          display={{base: 'none', md: 'flex'}}
          boxSize={16}
          src={logo}
          alt={'Logo'}
        />
        <Text fontSize="lg" fontWeight="bold">
          Library App
        </Text>
        <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
      </Flex>
      {LinkItems.map((link) => (
        <NavItem selected={location.pathname} href={link.href} key={link.name} icon={link.icon} onClick={() => {
          navigate(link.href);
          onClose();
        }}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({selected, href, icon, children, ...rest}: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bgColor={selected === href ? 'teal' : 'none'}
      color={selected === href ? 'white' : 'none'}
      _hover={{
        bg: 'teal.600',
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

const MobileNav = ({onOpen, ...rest}: MobileProps) => {
  const user = useSelector(state => state.account.user);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useDisclosure();
  const [data, setData] = useState<UserType>({});

  useEffect(() => {
    getProfile();
  }, [user]);

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
      })
    }
  }

  const getProfile = async () => {
    const res: ResponseType = await getUserAPI(user.id);
    if (res && !res.error) {
      setData(res.data);
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
      <Flex
        ml={{base: 0, md: 60}}
        px={{base: 4, md: 4}}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{base: 'space-between', md: 'flex-end'}}
        {...rest}>
        <IconButton
          display={{base: 'flex', md: 'none'}}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu/>}
        />

        <Image
          display={{base: 'flex', md: 'none'}}
          boxSize={16}
          src={logo}
          alt={'Logo'}
        />

        <HStack spacing={{base: '0', md: '6'}}>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{boxShadow: 'none'}}>
                <HStack>
                  <Avatar size={'sm'}/>
                  <VStack
                    display={{base: 'none', md: 'flex'}}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2">
                    <Text fontSize="sm">{user.name}</Text>
                    <Text fontSize="xs" color="gray.600">{user.role}</Text>
                  </VStack>
                  <Box display={{base: 'none', md: 'flex'}}>
                    <FiChevronDown/>
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
                <MenuItem onClick={profile.onOpen}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
      <Profile data={data} isOpen={profile.isOpen} onClose={profile.onClose}/>
    </>

  )
}

const AdminLayout = (props: PropsWithChildren) => {
  const layout = useDisclosure();


  return (
    <>
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <SidebarContent onClose={() => layout.onClose} display={{base: 'none', md: 'block'}}/>
        <Drawer
          isOpen={layout.isOpen}
          placement="left"
          onClose={layout.onClose}
          returnFocusOnClose={false}
          onOverlayClick={layout.onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={layout.onClose}/>
          </DrawerContent>
        </Drawer>
        <MobileNav onOpen={layout.onOpen}/>
        <Box ml={{base: 0, md: 60}} p="4">
          <Box bgColor={'white'} borderRadius={8} p={4}>
            {props.children}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AdminLayout