import axios from 'axios';
import { CreateTaskDto } from '../../../server/src/app/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../../../server/src/app/tasks/dto/update-task.dto';

describe('POST /api/tasks', () => {
  let createTaskDto: CreateTaskDto = {
    name: 'Clean Computer',
  };
  let createTaskDto2: CreateTaskDto = {
    name: 'Clean Computereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  };
  let createTaskDto3 = {
    name: 'Make breakfast',
    endDate: new Date().toJSON(),
  };

  it('should return an error because name is to long', async () => {
    const res = axios.post(`/api/tasks`, createTaskDto2);

    await expect(res).rejects.toThrowError(
      'Request failed with status code 400'
    );
  });

  it('should return an error becuase not param', async () => {
    const res = axios.post(`/api/tasks`);

    await expect(res).rejects.toThrowError(
      'Request failed with status code 400'
    );
  });

  it('should return the created task 1', async () => {
    const res = await axios.post(`/api/tasks`, createTaskDto);
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(createTaskDto);
  });

  it('should return the created task 2', async () => {
    const res = await axios.post(`/api/tasks`, createTaskDto3);
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(createTaskDto3);
  });
});

describe('GET /api/tasks/id', () => {
  it('should return single tasks', async () => {
    const res1 = await axios.get(`/api/tasks`);
    const id = res1.data[0]?._id;
    const res2 = await axios.get(`/api/tasks/${id}`);
    expect(res2.status).toBe(200);
    expect(res2.data).toMatchObject({ _id: id });
  });

  it('should return an error because id not existing 1', async () => {
    const id = '282293929';
    const res = await axios.get(`/api/tasks/${id}`);
    expect(res.data.response.statusCode).toEqual(404);
  });

  it('should return an error because id not existing 2', async () => {
    const id = '64a7c30bf111f012173b8241';
    const res = await axios.get(`/api/tasks/${id}`);
    expect(res.data.response.statusCode).toEqual(404);
  });
});

describe('PUT /api/tasks', () => {
  it('should return confirmation object from MongoDB for updating task', async () => {
    const res1 = await axios.get(`/api/tasks`);
    const element = res1.data?.find((e) => {
      return e?.name === 'Clean Computer';
    });
    const id = element._id;
    const updateTaskDto: UpdateTaskDto = {
      name: 'Clean Laptop',
      isDone: true,
    };
    const res2 = await axios.put(`/api/tasks/${id}`, updateTaskDto);
    expect(res2.status).toBe(200);
    expect(res2.data).toMatchObject({ modifiedCount: 1 });
  });

  it('should return an error because id doesnt exist', async () => {
    const id = 'djdfj293';
    const updateTaskDto: UpdateTaskDto = {
      name: 'Clean Laptop',
      isDone: true,
    };
    const res = await axios.put(`/api/tasks/${id}`, updateTaskDto);
    expect(res.data.response.statusCode).toEqual(404);
  });

  it('should return an error because name is not valid', async () => {
    const res1 = await axios.get(`/api/tasks`);
    const id = res1.data[0]?._id;
    const updateTaskDto: UpdateTaskDto = {
      name: 'Clean Laptopddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
      isDone: true,
    };
    const res = axios.put(`/api/tasks/${id}`, updateTaskDto);
    await expect(res).rejects.toThrowError(
      'Request failed with status code 400'
    );
  });

  it('should return an error because date is not valid', async () => {
    const res1 = await axios.get(`/api/tasks`);
    const id = res1.data[0]?._id;
    const updateTaskDto = {
      name: 'Clean Laptop',
      isDone: true,
      endDate: '21.01.2025',
    };
    const res = axios.put(`/api/tasks/${id}`, updateTaskDto);
    await expect(res).rejects.toThrowError(
      'Request failed with status code 400'
    );
  });

  describe('GET /api/tasks', () => {
    it('should return an array of tasks', async () => {
      const res = await axios.get(`/api/tasks`);
      console.log(res.data);

      expect(res.status).toBe(200);
      expect(res.data).toBeInstanceOf(Array);
    });

    it('should return an array of tasks with isDone=true', async () => {
      const res = await axios.get(`/api/tasks?filter=done`);

      expect(res.status).toBe(200);
      res.data.map((e) => expect(e).toMatchObject({ isDone: true }));
    });

    it('should return an array of tasks with isDone=false', async () => {
      const res = await axios.get(`/api/tasks?filter=toDo`);

      expect(res.status).toBe(200);
      res.data.map((e) => expect(e).toMatchObject({ isDone: false }));
    });
    it('should return an array of tasks with an endDate', async () => {
      const res = await axios.get(`/api/tasks?filter=dateLimit`);

      expect(res.status).toBe(200);
      res.data.map((e) => expect(e).toHaveProperty('endDate'));
    });
  });

  describe('DELETE /api/tasks/id', () => {
    it('should return object with comfirmation of deletion 1', async () => {
      const res1 = await axios.get(`/api/tasks`);
      const element = res1.data?.find((e) => {
        return e?.name === 'Clean Laptop';
      });
      const id = element._id;
      const res2 = await axios.delete(`/api/tasks/${id}`);
      expect(res2.data).toMatchObject({ deletedCount: 1 });
    });

    it('should return object with comfirmation of deletion 2', async () => {
      const res1 = await axios.get(`/api/tasks`);
      const element = res1.data?.find((e) => {
        return e?.name === 'Make breakfast';
      });
      const id = element._id;
      const res2 = await axios.delete(`/api/tasks/${id}`);
      expect(res2.data).toMatchObject({ deletedCount: 1 });
    });

    it('should return an error because id not existing 1', async () => {
      const id = '282293929';
      const res = await axios.delete(`/api/tasks/${id}`);
      expect(res.data.response.statusCode).toEqual(404);
    });

    it('should return an error because id is not passed', async () => {
      const res = axios.delete(`/api/tasks`);
      await expect(res).rejects.toThrowError(
        'Request failed with status code 404'
      );
    });
  });
});
