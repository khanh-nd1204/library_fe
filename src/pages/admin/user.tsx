import {useEffect, useState} from "react";
import {getUsersAPI} from "../../services/user.service.ts";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast,
  Badge,
  Button,
  Input, Flex, IconButton, Tooltip, HStack
} from '@chakra-ui/react'
import {ResponseType} from "../../types/response.type.ts";
import {UserType} from "../../types/user.type.ts";
import {ChevronDownIcon, ChevronUpIcon, ViewIcon, EditIcon, DeleteIcon} from "@chakra-ui/icons";
import { useDebouncedCallback } from 'use-debounce';
import { Pagination } from 'chakra-pagination/src/components';

const UserPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState();
  const [sort, setSort] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const columns = ['name', 'email', 'phone', 'address'];
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getUserList();
  }, [sort, sortDirection, filter]);

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
        duration: 2000,
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
      <Input placeholder='Search input' maxW={300} mb={4} onChange={(e) => debounced(e.target.value)}/>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>User List</TableCaption>
          <Thead>
            <Tr >
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
                    <Td>{item.name}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.phone}</Td>
                    <Td>{item.address}</Td>
                    <Td>{item.role}</Td>
                    <Td>{item.active ? <Badge colorScheme='green'>Active</Badge> : <Badge colorScheme='red'>Inactive</Badge>}</Td>
                    <Td>
                      <HStack>
                        <Tooltip label='View detail'>
                          <IconButton
                            aria-label='View'
                            icon={<ViewIcon />}
                          />
                        </Tooltip>

                        <Tooltip label='Edit'>
                          <IconButton
                            aria-label='Edit'
                            icon={<EditIcon />}
                          />
                        </Tooltip>

                        <Tooltip label='Delete'>
                          <IconButton
                            aria-label='Delete'
                            icon={<DeleteIcon />}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })
            }
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify='right'>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          total={total}
          colorScheme={'blue'}
          perPage={10}
        />
      </Flex>
    </>
  )
}

export default UserPage