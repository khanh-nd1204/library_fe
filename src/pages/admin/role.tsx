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
import {getRolesAPI} from "../../services/role.service.ts";
import {RoleType} from "../../types/role.type.ts";
import DeleteRole from "../../components/role/delete.tsx";
import CreateRole from "../../components/role/create.tsx";
import {getPermissionsAPI} from "../../services/permission.service.ts";
import UpdateRole from "../../components/role/update.tsx";

const RolePage = () => {
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
      name: 'description',
      value: 'description'
    },
    {
      name: 'created at',
      value: 'createdAt'
    },
    {
      name: 'updated at',
      value: 'updatedAt'
    }
  ];
  const [filter, setFilter] = useState('');
  const [dataSelected, setDataSelected] = useState<RoleType>({});
  const update = useDisclosure();
  const create = useDisclosure();
  const remove = useDisclosure();
  const [permissionList, setPermissionList] = useState([]);

  useEffect(() => {
    getRoleList();
  }, [sort, sortDirection, filter, page, size]);

  const getRoleList = async () => {
    const filterStr = 'filter=' + columns.map((item) => `${item.value}~'${filter}'`).join(' or ');
    const query = `page=${page}&size=${size}&sort=${sort},${sortDirection}&${filterStr}`;
    setLoading(true);
    const res: ResponseType = await getRolesAPI(query);
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

  useEffect(() => {
    const getPermissionList = async () => {
      const query = `page=${1}&size=${100}`;
      const res: ResponseType = await getPermissionsAPI(query);
      if (res && res.data) {
        const groupedByModule = res.data.data.reduce((result, api) => {
          const {module, ...apiDetails} = api;
          if (!result[module]) {
            result[module] = {module, api: []};
          }
          result[module].api.push(apiDetails);
          return result;
        }, {});
        const resultList = Object.values(groupedByModule);
        setPermissionList(resultList);
      } else {
        setPermissionList([]);
        console.error(res.message);
      }
    }
    getPermissionList();
  }, []);

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
        <Input placeholder='Search role' maxW={{base: 'full', md: '300'}}
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
              {columns.map((item) => {
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
            {data.map((item: RoleType, index) => {
              return (
                <Tr key={item.id}>
                  <Td><Skeleton isLoaded={!loading}>{index + 1 + (page - 1) * size}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.name}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.description}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.createdAt}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.updatedAt}</Skeleton></Td>
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

      <CreateRole isOpen={create.isOpen} onClose={create.onClose} getRoleList={getRoleList}
                  permissionList={permissionList}/>
      <UpdateRole isOpen={update.isOpen} onClose={update.onClose} dataSelected={dataSelected} getRoleList={getRoleList}
                  permissionList={permissionList}/>
      <DeleteRole isOpen={remove.isOpen} onClose={remove.onClose} dataSelected={dataSelected} getRoleList={getRoleList}
                  setPage={setPage}/>
    </>
  )
}

export default RolePage