import {useEffect, useState} from "react";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import {ResponseType} from "../../types/response.type.ts";
import {AddIcon, ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useDebouncedCallback} from 'use-debounce';
import {Pagination} from 'chakra-pagination/src/components';
import {getPermissionsAPI} from "../../services/permission.service.ts";
import {PermissionType} from "../../types/permission.type.ts";
import CreatePermission from "../../components/permission/create.tsx";
import UpdatePermission from "../../components/permission/update.tsx";
import DeletePermission from "../../components/permission/delete.tsx";

const PermissionPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const columns = [
    {
      name: 'name',
      value: 'name'
    },
    {
      name: 'method',
      value: 'method'
    },
    {
      name: 'module',
      value: 'module'
    },
    {
      name: 'api path',
      value: 'apiPath'
    }
  ];
  const [filter, setFilter] = useState('');
  const [dataSelected, setDataSelected] = useState<PermissionType>({});
  const update = useDisclosure();
  const create = useDisclosure();
  const remove = useDisclosure();

  useEffect(() => {
    getPermissionList();
  }, [sort, sortDirection, filter, page, size]);

  const getPermissionList = async () => {
    const filterStr = 'filter=' + columns.map((item) => `${item.value}~'${filter}'`).join(' or ');
    const query = `page=${page}&size=${size}&sort=${sort},${sortDirection}&${filterStr}`;
    setLoading(true);
    const res: ResponseType = await getPermissionsAPI(query);
    setLoading(false);
    if (res && res.data) {
      setData(res.data.data);
      setPage(res.data.page);
      setSize(res.data.size);
      setTotal(res.data.totalElements);
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
      setPage(1);
      setFilter(value);
    },
    1000
  );

  const handleSize = (value: number) => {
    setPage(1);
    setSize(value);
  }

  return (
    <>
      <Flex justify='space-between' mb={4} direction={{base: 'column', md: 'row'}} gap={4}>
        <Input placeholder='Search permission' maxW={{base: 'full', md: '300'}}
               onChange={(e) => debounced(e.target.value)}
        />
        <Button colorScheme='teal' maxW={'max-content'} ml={'auto'} variant={'solid'} rightIcon={<AddIcon/>}
                onClick={create.onOpen}>
          Create
        </Button>
      </Flex>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th fontSize='sm'>#</Th>
              {columns.map(item => {
                return <Th key={item.value}>
                  <Button
                    p={0}
                    fontSize='sm'
                    fontWeight={500}
                    _hover={{bg: 'none'}}
                    variant="ghost"
                    onClick={() => handleSort(item.value)}
                    rightIcon={sort === item.value && sortDirection === 'asc' ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                  >
                    {item.name.toUpperCase()}
                  </Button>
                </Th>
              })
              }
              <Th>
                <Button
                  p={0}
                  fontSize='sm'
                  fontWeight={500}
                  _hover={{bg: 'none', cursor: 'default'}}
                  variant="ghost"
                >
                  ACTIONS
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item: PermissionType, index) => {
              return (
                <Tr key={item.id}>
                  <Td><Skeleton isLoaded={!loading}>{index + 1 + (page - 1) * size}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.name}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>
                    {item.method === 'POST' && <span style={{color: 'yellow'}}>{item.method}</span>}
                    {item.method === 'PATCH' && <span style={{color: 'violet'}}>{item.method}</span>}
                    {item.method === 'DELETE' && <span style={{color: 'red'}}>{item.method}</span>}
                    {item.method === 'GET' && <span style={{color: 'green'}}>{item.method}</span>}
                  </Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.module}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.apiPath}</Skeleton></Td>
                  <Td>
                    <HStack>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label='Edit'>
                          <IconButton
                            aria-label='Edit'
                            icon={<EditIcon/>}
                            onClick={() => {
                              update.onOpen();
                              setDataSelected(item);
                            }}
                          />
                        </Tooltip>
                      </Skeleton>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label='Delete'>
                          <IconButton
                            aria-label='Delete'
                            icon={<DeleteIcon/>}
                            onClick={() => {
                              remove.onOpen();
                              setDataSelected(item);
                            }}
                          />
                        </Tooltip>
                      </Skeleton>
                    </HStack>
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
          value={size}
          onChange={(e) => handleSize(parseInt(e.target.value, 10))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </Select>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          total={total}
          perPage={size}
          colorScheme={'teal'}
        />
      </Flex>

      <CreatePermission isOpen={create.isOpen} onClose={create.onClose} getPermissionList={getPermissionList}/>
      <UpdatePermission isOpen={update.isOpen} onClose={update.onClose} getPermissionList={getPermissionList}
                        dataSelected={dataSelected}/>
      <DeletePermission isOpen={remove.isOpen} onClose={remove.onClose} dataSelected={dataSelected}
                        getPermissionList={getPermissionList} setPage={setPage}/>
    </>
  )
}

export default PermissionPage