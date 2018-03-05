package com.skt.hms.task;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skt.hms.main.model.MainSearchModel;
import com.skt.hms.task.model.TaskMgmtModel;
import com.skt.hms.task.model.TaskMgmtSearchModel;


@Service
public class TaskMgmtService {

	@Autowired
	private TaskMgmtMapper taskMgmtMapper;

	/**
	 * Task 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<TaskMgmtModel> getTaskList(TaskMgmtSearchModel param) throws Exception{
		List<TaskMgmtModel> resultModel = taskMgmtMapper.getTaskList(param);
		return resultModel;
	}

	/**
	 * task 파일명 동일 여부 체크
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int getDuplicationsTaskName(TaskMgmtSearchModel param) throws Exception{
		return taskMgmtMapper.getDuplicationsTaskName(param);
	}
}
