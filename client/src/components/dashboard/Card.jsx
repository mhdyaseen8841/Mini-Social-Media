import { Avatar, Stack, Text, WrapItem } from '@chakra-ui/react'
import React from 'react'

const Card = ({image,name,id}) => {
  return (
    <WrapItem  borderRadius="md"  my="10px" p="4" bg="white" color="black" _hover={{cursor: 'pointer'}}>
    <Avatar
      name={name}
      borderRadius="full"
      src={image}
    />
    <Stack pl={3}>
      <Text fontSize="md">{name}</Text>
      <Text fontSize="sm">{id}</Text>
    </Stack>
  </WrapItem>
  )
}

export default Card