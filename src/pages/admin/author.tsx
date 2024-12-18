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
} from "@chakra-ui/react";
import {ResponseType} from "../../types/response.type.ts";
import {useDebouncedCallback} from "use-debounce";
import {AddIcon, ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Pagination} from "chakra-pagination/src/components";
import {getAuthorsAPI} from "../../services/author.service.ts";
import {AuthorType} from "../../types/author.type.ts";
import CreateAuthor from "../../components/author/create.tsx";
import UpdateAuthor from "../../components/author/update.tsx";
import DeleteAuthor from "../../components/author/delete.tsx";

const AuthorPage = () => {
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
      name: 'nationality',
      value: 'nationality'
    },
    {
      name: 'pen name',
      value: 'penName'
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
  const [dataSelected, setDataSelected] = useState<AuthorType>({});
  const update = useDisclosure();
  const create = useDisclosure();
  const remove = useDisclosure();

  useEffect(() => {
    getAuthorList();
  }, [sort, sortDirection, filter, page, size]);

  const getAuthorList = async () => {
    const filterStr = 'filter=' + columns.map((item) => `${item.value}~'${filter}'`).join(' or ');
    const query = `page=${page}&size=${size}&sort=${sort},${sortDirection}&${filterStr}`;
    setLoading(true);
    const res: ResponseType = await getAuthorsAPI(query);
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
        <Input placeholder='Search author' maxW={{base: 'full', md: '300'}}
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
            {data.map((item: AuthorType, index) => {
              return (
                <Tr key={item.id}>
                  <Td><Skeleton isLoaded={!loading}>{index + 1 + (page - 1) * size}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.name}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.nationality}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.penName}</Skeleton></Td>
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

      <CreateAuthor isOpen={create.isOpen} onClose={create.onClose} getAuthorList={getAuthorList}/>
      <UpdateAuthor isOpen={update.isOpen} onClose={update.onClose} getAuthorList={getAuthorList}
                    dataSelected={dataSelected}/>
      <DeleteAuthor isOpen={remove.isOpen} onClose={remove.onClose} dataSelected={dataSelected}
                    getAuthorList={getAuthorList} setPage={setPage}/>
    </>
  )
}

export default AuthorPage