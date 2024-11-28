import {useEffect, useState} from "react";
import {getUsersAPI} from "../../services/user.service.ts";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Badge,
  Button,
  Input,
  Flex,
  IconButton,
  HStack,
  Select,
  Skeleton, useDisclosure, Tooltip
} from '@chakra-ui/react'
import {ResponseType} from "../../types/response.type.ts";
import {UserType} from "../../types/user.type.ts";
import {AddIcon, ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import { useDebouncedCallback } from 'use-debounce';
import { Pagination } from 'chakra-pagination/src/components';
import UpdateUser from "../../components/user/update.tsx";
import DeleteUser from "../../components/user/delete.tsx";
import CreateUser from "../../components/user/create.tsx";

const UserPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const columns = ['name', 'email', 'phone', 'address'];
  const [filter, setFilter] = useState('');
  const [dataSelected, setDataSelected] = useState<UserType>({});
  const update = useDisclosure();
  const create = useDisclosure();
  const remove = useDisclosure();

  useEffect(() => {
    getUserList();
  }, [sort, sortDirection, filter, page, size]);

  const getUserList = async () => {
    const filterStr = 'filter=' + columns.map((column) => `${column}~'${filter}'`).join(' or ');
    const query = `page=${page}&size=${size}&sort=${sort},${sortDirection}&${filterStr}`;
    setLoading(true);
    const res: ResponseType = await getUsersAPI(query);
    setLoading(false);
    if (res && res.data) {
      setData(res.data.data);
      setPage(res.data.page);
      setSize(res.data.size);
      setTotal(res.data.totalPages);
    } else {
      setData([]);
      toast({
        title: res.error,
        description: Array.isArray(res.message) ? res.message[0] : res.message,
        status: 'error',
      })
    }
  }

  const handleSort = (sort: string) => {
    setSort(sort);
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortDirection('asc');
    }
  }

  const debounced = useDebouncedCallback(
    (value: string) => {
      setFilter(value);
    },
    1000
  );



  return (
    <>
      <Flex justify='space-between' mb={4} direction={{ base: 'column', md: 'row' }} gap={4}>
        <Input placeholder='Search input' maxW={{ base: 'full', md: '300' }} colorScheme='teal' focusBorderColor='teal.600'
               onChange={(e) => debounced(e.target.value)}
        />
        <Button colorScheme='teal' maxW={'max-content'} ml={'auto'} variant={'solid'} rightIcon={<AddIcon />} onClick={create.onOpen}>
          Create
        </Button>
      </Flex>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              {columns.map(item => {
                return <Th key={item}>
                    <Button
                      p={0}
                      fontSize='sm'
                      fontWeight={500}
                      _hover={{ bg: 'none' }}
                      variant="ghost"
                      onClick={() => handleSort(item)}
                      rightIcon={sort === item && sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    >
                      {item.toUpperCase()}
                    </Button>
                  </Th>
                })
              }
              <Th>
                <Button
                  p={0}
                  fontSize='sm'
                  fontWeight={500}
                  _hover={{ bg: 'none', cursor: 'default' }}
                  variant="ghost"
                >
                  ROLE
                </Button>
              </Th>
              <Th>
                <Button
                  p={0}
                  fontSize='sm'
                  fontWeight={500}
                  _hover={{ bg: 'none', cursor: 'default' }}
                  variant="ghost"
                >
                  STATUS
                </Button>
              </Th>
              <Th>
                <Button
                  p={0}
                  fontSize='sm'
                  fontWeight={500}
                  _hover={{ bg: 'none', cursor: 'default' }}
                  variant="ghost"
                >
                  ACTIONS
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item: UserType) => {
                return (
                  <Tr key={item.id}>
                    <Td><Skeleton isLoaded={!loading}>{item.name}</Skeleton></Td>
                    <Td><Skeleton isLoaded={!loading}>{item.email}</Skeleton></Td>
                    <Td><Skeleton isLoaded={!loading}>{item.phone}</Skeleton></Td>
                    <Td><Skeleton isLoaded={!loading}>{item.address}</Skeleton></Td>
                    <Td><Skeleton isLoaded={!loading}>{item.role}</Skeleton></Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        {item.active ? <Badge colorScheme='green'>Active</Badge> : <Badge colorScheme='red'>Inactive</Badge>}
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <HStack>
                          <Tooltip label='Edit'>
                            <IconButton
                              aria-label='Edit'
                              icon={<EditIcon />}
                              onClick={() => {
                                update.onOpen();
                                setDataSelected(item);
                              }}
                            />
                          </Tooltip>
                          <Tooltip label='Delete'>
                            <IconButton
                              aria-label='Delete'
                              icon={<DeleteIcon />}
                              onClick={() => {
                                remove.onOpen();
                                setDataSelected(item);
                              }}
                            />
                          </Tooltip>
                        </HStack>
                      </Skeleton>
                    </Td>
                  </Tr>
                );
              })
            }
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify='space-between' mt={4}>
        <Select
          maxW={20}
          cursor='pointer'
          focusBorderColor="teal.600"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value, 10))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </Select>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          total={total}
          colorScheme={'teal'}
        />
      </Flex>

      <CreateUser isOpen={create.isOpen} onClose={create.onClose} getUserList={getUserList} />
      <UpdateUser isOpen={update.isOpen} onClose={update.onClose} dataSelected={dataSelected} getUserList={getUserList}/>
      <DeleteUser isOpen={remove.isOpen} onClose={remove.onClose} dataSelected={dataSelected} getUserList={getUserList}  />
    </>
  )
}

export default UserPage