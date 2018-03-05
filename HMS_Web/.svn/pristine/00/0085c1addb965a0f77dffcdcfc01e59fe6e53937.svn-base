package com.skt.hms.task;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.skt.hms.main.model.MainSearchModel;
import com.skt.hms.task.model.TaskMgmtModel;
import com.skt.hms.task.model.TaskMgmtSearchModel;

@Repository("TaskMgmtMapper")
public interface TaskMgmtMapper {
	
	/**
	 * Task 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<TaskMgmtModel> getTaskList(TaskMgmtSearchModel filter) throws Exception;
	
	/**
	 * task 파일명 동일 여부 체크
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public int getDuplicationsTaskName(TaskMgmtSearchModel filter) throws Exception;
}
