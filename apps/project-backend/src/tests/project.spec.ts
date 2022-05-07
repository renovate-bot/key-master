import {
  Client,
  createProject,
  deleteProject,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Project', () => {
  let client: Client = null;
  beforeAll(() => {
    client = projectOwnerAClient;
  });
  describe('Mutation', () => {
    it('creates new project', async () => {
      const projectName = `MOCK_PROJECT_${nanoid()}`;
      const project = await client.chain.mutation
        .createProject({
          input: {
            name: projectName,
          },
        })
        .get({
          id: true,
          name: true,
        });

      expect(project.id).toBeDefined();
      expect(project.name).toEqual(projectName);
    });

    it('throws error when create duplicate project', async () => {
      const projectName = `MOCK_PROJECT_${nanoid()}`;
      await createProject({ customProjectName: projectName, client });
      expect(
        createProject({ client, customProjectName: projectName })
      ).rejects.toBeTruthy();
    });

    it('updates an existing project', async () => {
      const projectName = `MOCK_PROJECT_${nanoid()}`;
      const newProjectName = `NEW_PROJECT_${nanoid()}`;

      const projectId = (
        await createProject({ customProjectName: projectName, client })
      ).id;

      const updatedProject = await client.chain.mutation
        .updateProject({
          id: projectId,
          input: {
            name: newProjectName,
          },
        })
        .get({
          id: true,
          name: true,
        });
      expect(updatedProject.id).toEqual(projectId);
      expect(updatedProject.name).toEqual(newProjectName);
    });

    it('throws error when update a deleted project', async () => {
      const project = await createProject({ client });
      await client.chain.mutation
        .deleteProject({
          id: project.id,
        })
        .success.get();

      expect(
        client.chain.mutation
          .updateProject({
            id: project.id,
            input: {
              name: 'TEST',
            },
          })
          .id.get()
      ).rejects.toBeTruthy();
    });
    it('deletes an existing project', async () => {
      const project = await createProject({ client });
      expect(
        await client.chain.mutation
          .deleteProject({
            id: project.id,
          })
          .success.get()
      ).toBeTruthy();
    });

    it('throws error with wrong id', async () => {
      expect(
        client.chain.mutation
          .deleteProject({
            id: 'MOCK_WRONG_PROJECT_ID',
          })
          .success.get()
      ).rejects.toBeTruthy();
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const project = await createProject({ client });
      const getProject = await client.chain.query
        .getProjectById({ id: project.id })
        .get({
          id: true,
          name: true,
        });

      expect(project).toEqual(getProject);
    });

    it('throws error when get by wrong id', () => {
      expect(
        client.chain.query.getProjectById({ id: 'MOCK_WRONG_PROJECT_ID' }).get({
          id: true,
          name: true,
        })
      ).rejects.toBeTruthy();
    });
    it('throws error when get by deleted id', async () => {
      const newProject = await createProject({ client });
      await deleteProject({ client, id: newProject.id });
      expect(
        client.chain.query.getProjectById({ id: newProject.id })
      ).rejects.toBeTruthy();
    });
  });
});