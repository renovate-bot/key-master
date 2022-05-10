import { Permission } from '@prisma/client';
import { prismaClient } from '../client';

export const permissions: Pick<Permission, 'id' | 'permission'>[] = [
  {
    id: 'afc553ac-654e-4796-b106-1c8c815c0e7a',
    permission: 'USER_WRITE',
  },
  {
    id: '4ad29fb3-1291-4d3d-a17a-24cc60af7142',
    permission: 'USER_READ',
  },
  {
    id: 'cca0ec98-c572-4bdd-b353-08e60f8937cb',
    permission: 'PROJECT_READ',
  },
  {
    id: '98a1749e-171f-4cf7-a060-b4d4912da96e',
    permission: 'PROJECT_WRITE',
  },
  {
    id: '4159ac61-9ed6-4a47-a4fd-9cbdae938b11',
    permission: 'ROLE_READ',
  },
  {
    id: '37906c51-4509-4419-b71c-40fd083659b9',
    permission: 'ROLE_WRITE',
  },
  {
    id: 'e161c02b-a2cd-4460-8005-3389f716475b',
    permission: 'PROJECT_ROLE_READ',
  },
  {
    id: 'c224b62c-0d52-4c21-8c17-bf6ead487328',
    permission: 'PROJECT_ROLE_WRITE',
  },
  {
    id: 'ed409ce5-11a4-44e0-990a-7dd9cf9154e9',
    permission: 'PROJECT_USER_READ',
  },
  {
    id: '65ca3188-e54a-4b31-9dd8-ba388f9d4e5a',
    permission: 'PROJECT_USER_WRITE',
  },
  {
    id: '1e113c99-79df-4cec-ba87-6e9b2f6aa1aa',
    permission: 'PERMISSION_WRITE',
  },
  {
    id: 'ff7ac44e-2887-4002-8698-65cbf8fb139e',
    permission: 'PERMISSION_READ',
  },
  {
    id: 'd7be792e-f768-4ea5-a257-da4bf2db122d',
    permission: 'PROJECT_ROLE_READ',
  },
  {
    id: '86ecb4fe-6284-487b-bc01-be764b7f4db9',
    permission: 'PROJECT_ROLE_WRITE',
  },
  {
    id: '7131df8e-3e19-45fa-ad14-9739164bf993',
    permission: 'PROJECT_DELETE',
  },
  {
    id: 'b569cf2b-ce95-4292-8758-d88c89443dd8',
    permission: 'PROJECT_READ',
  },
];

export const createPermissions = async () => {
  const listCreatePermissions = permissions.map((data) =>
    prismaClient.permission.upsert({
      where: {
        id: data.id,
      },
      update: {},
      create: data,
    })
  );
  const result = await prismaClient.$transaction(listCreatePermissions);
  console.log('Created permissions', { permissions: result });
};
