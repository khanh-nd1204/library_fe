import {useEffect, useState} from "react";
import {
  Badge,
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
import {BookType} from "../../types/book.type.ts";
import {getBooksAPI} from "../../services/book.service.ts";
import CreateBook from "../../components/book/create.tsx";
import {getPublishersAPI} from "../../services/publisher.service.ts";
import {getAuthorsAPI} from "../../services/author.service.ts";
import {getCategoriesAPI} from "../../services/category.service.ts";
import {PublisherType} from "../../types/publisher.type.ts";
import {AuthorType} from "../../types/author.type.ts";
import {CategoryType} from "../../types/category.type.ts";

const BookPage = () => {
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
      name: 'authors',
      value: 'authors.name'
    },
    {
      name: 'categories',
      value: 'categories.name'
    },
    {
      name: 'publisher',
      value: 'publisher.name'
    },
    {
      name: 'publish year',
      value: 'publishYear'
    },
    {
      name: 'quantity',
      value: 'quantity'
    },
  ];
  const [filter, setFilter] = useState('');
  const [dataSelected, setDataSelected] = useState<BookType>({});
  const update = useDisclosure();
  const create = useDisclosure();
  const remove = useDisclosure();
  const [authorList, setAuthorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [publisherList, setPublisherList] = useState([]);

  useEffect(() => {
    getBookList();
  }, [sort, sortDirection, filter, page, size]);

  const getBookList = async () => {
    const filterStr = 'filter=' + columns.map((item) => `${item.value}~'${filter}'`).join(' or ');
    const query = `page=${page}&size=${size}&sort=${sort},${sortDirection}&${filterStr}`;
    setLoading(true);
    const res: ResponseType = await getBooksAPI(query);
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
    getPublisherList();
    getAuthorList();
    getCategoryList();
  }, []);

  const getPublisherList = async () => {
    const query = `page=${1}&size=${100}`;
    const res: ResponseType = await getPublishersAPI(query);
    if (res && res.data) {
      setPublisherList(res.data.data.map((item: PublisherType) => ({
        label: item.name,
        value: item.id
      })));
    } else {
      setPublisherList([]);
      console.error(res.message);
    }
  }

  const getAuthorList = async () => {
    const query = `page=${1}&size=${100}`;
    const res: ResponseType = await getAuthorsAPI(query);
    if (res && res.data) {
      setAuthorList(res.data.data.map((item: AuthorType) => ({
        label: item.name,
        value: item.id
      })));
    } else {
      setAuthorList([]);
      console.error(res.message);
    }
  }

  const getCategoryList = async () => {
    const query = `page=${1}&size=${100}`;
    const res: ResponseType = await getCategoriesAPI(query);
    if (res && res.data) {
      setCategoryList(res.data.data.map((item: CategoryType) => ({
        label: item.name,
        value: item.id
      })));
    } else {
      setCategoryList([]);
      console.error(res.message);
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
        <Input placeholder='Search book' maxW={{base: 'full', md: '300'}}
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
                  STATUS
                </Button>
              </Th>
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
            {data.map((item: BookType, index) => {
              return (
                <Tr key={item.id}>
                  <Td><Skeleton isLoaded={!loading}>{index + 1 + (page - 1) * size}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.name}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.authors}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.categories}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.publisher}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.publishYear}</Skeleton></Td>
                  <Td><Skeleton isLoaded={!loading}>{item.quantity}</Skeleton></Td>
                  <Td>
                    <Skeleton isLoaded={!loading}>
                      {item.active ? <Badge colorScheme='green'>Active</Badge> :
                        <Badge colorScheme='red'>Inactive</Badge>}
                    </Skeleton>
                  </Td>
                  <Td>
                    {item.active &&
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
                    }
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

      <CreateBook isOpen={create.isOpen} onClose={create.onClose} getBookList={getBookList} authorList={authorList}
                  categoryList={categoryList} publisherList={publisherList}/>
    </>
  )
}

export default BookPage