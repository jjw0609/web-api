## Event loop

- [이벤트 루프 동작 예시 영상 보기](https://lydiahallie.b-cdn.net/blog/event-loop/Screen_Recording_2024-03-31_at_8.24.17_PM_cwetjv.mp4) (출처: https://www.lydiahallie.com/blog/event-loop)


## Chromium Source Code

- Chromium 코드 검색 사이트: https://source.chromium.org/chromium

- 브라우저 환경 javascript에서 `setInterval`을 호출했을 때 타이머가 동작하는 것은 **마법이 아니다**

  1. javascript에서 `setInterval`을 호출하면, [V8과 바인딩된 C++ 코드](https://source.chromium.org/chromium/chromium/src/+/main:out/linux-Debug/gen/third_party/blink/renderer/bindings/modules/v8/v8_window.cc;l=23732)에서 `DOMTimer::setInterval`이 실행된다.
  2. [DOMTimer::setInterval 정적 메서드](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/scheduler/dom_timer.cc;l=216;bpv=0;bpt=1)가 호출되고, DOMTimer 인스턴스를 만들면서 DOMTimer 생성자가 호출된다.
  3. [DOMTimer 생성자 코드](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/scheduler/dom_timer.cc;l=260;bpv=0;bpt=1)에서 [`startRepeating` 함수](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/timer.h;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=0;bpt=1;l=74)가 실행된다.
  4. [TimerBase::Start 함수](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/timer.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=0;bpt=1;l=54) [TimerBase::SetNextFireTime](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/timer.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=0;bpt=1;l=122)를 호출한다.
  5. [SequencedTaskRunner::PostCancelableDelayedTaskAt](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequenced_task_runner.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;l=46)가 호출되고, [SequencedTaskRunner::PostDelayedTaskAt](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequenced_task_runner.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=1;bpt=1;l=67)이 호출된다.
  6. [TaskRunner:PostTask](https://source.chromium.org/chromium/chromium/src/+/main:base/task/task_runner.cc;l=18;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638)가 호출한 `PostDelayedTask`는 `sequence_manager`의 [TaskQueueImpl::TaskRunner::PostDelayedTask](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/task_queue_impl.cc;l=153;drc=4e698e3204c71aa8e4336776abebf6af9c768269)로 위임된다.
  7. [TaskQueueImpl::PostTask](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/task_queue_impl.cc;drc=4e698e3204c71aa8e4336776abebf6af9c768269;l=368)는 `PostDelayedTaskImpl`를 호출하고, 이어서 ` [PushOntoDelayedIncomingQueueFromMainThread](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/task_queue_impl.cc;drc=4e698e3204c71aa8e4336776abebf6af9c768269;l=526)가 호출된다.
  8. `UpdateWakeUp`, `SetNextWakeUp`, `WakeUpQueue::SetNextWakeUpForQueue`, [`DefaultWakeUpQueue::OnNextWakeUpChanged`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/wake_up_queue.cc;l=141;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1), [`SequenceManagerImpl::SetNextWakeUp`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/sequence_manager_impl.cc;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1;l=475)가 차례로 실행되고, [`ThreadControllerWithMessagePumpImpl::SetNextDelayedDoWork`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/thread_controller_with_message_pump_impl.cc;l=191;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1)가 실행된다.
  9. 지연시간을 주는 [`ScheduleDelayedWork`](https://source.chromium.org/chromium/chromium/src/+/main:base/message_loop/message_pump.h;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1;l=265) 함수는, 각 운영체제별로 구현되어 있다.
  - [Android](https://source.chromium.org/chromium/chromium/src/+/main:base/message_loop/message_pump_android.cc;l=601;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1): [`timerfd_settime`](https://linux.die.net/man/2/timerfd_settime) system call 사용
  - [macOS](https://source.chromium.org/chromium/chromium/src/+/main:base/message_loop/message_pump_apple.mm;l=185;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1): [`CFRunLoopTimerSetNextFireDate`](https://developer.apple.com/documentation/corefoundation/cfrunlooptimersetnextfiredate(_:_:)) API 사용
  10. 타이머가 만기되면 task queue(work queue) -> RunInternal-> Fired -> execute -> v8 call stack 과정을 통해 setInterval에 등록한 callback 함수가 실행된다.


---
## Event loop

- [Watch event loop example video](https://lydiahallie.b-cdn.net/blog/event-loop/Screen_Recording_2024-03-31_at_8.24.17_PM_cwetjv.mp4) (Source: https://www.lydiahallie.com/blog/event-loop)


## Chromium Source Code

- Chromium code search site: https://source.chromium.org/chromium

- When you call `setInterval` in browser environment JavaScript, the timer working is **not magic**

  1. When you call `setInterval` in JavaScript, the [C++ code bound to V8](https://source.chromium.org/chromium/chromium/src/+/main:out/linux-Debug/gen/third_party/blink/renderer/bindings/modules/v8/v8_window.cc;l=23762;bpv=1;bpt=1) executes `DOMTimer::setInterval`.
  2. The [DOMTimer::setInterval static method](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/scheduler/dom_timer.cc;l=216;bpv=0;bpt=1) is called, and the DOMTimer constructor is called while creating a DOMTimer instance.
  3. In the [DOMTimer constructor code](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/scheduler/dom_timer.cc;l=260;bpv=0;bpt=1), the [`startRepeating` function](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/timer.h;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=0;bpt=1;l=74) is executed.
  4. The [TimerBase::Start function](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/timer.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=0;bpt=1;l=54) calls [TimerBase::SetNextFireTime](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/timer.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=0;bpt=1;l=122).
  5. [SequencedTaskRunner::PostCancelableDelayedTaskAt](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequenced_task_runner.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;l=46) is called, and [SequencedTaskRunner::PostDelayedTaskAt](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequenced_task_runner.cc;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638;bpv=1;bpt=1;l=67) is called.
  6. The `PostDelayedTask` called by [TaskRunner:PostTask](https://source.chromium.org/chromium/chromium/src/+/main:base/task/task_runner.cc;l=18;drc=cdc83ca27812e4b01b3766c164ca91a3b235e638) is delegated to [TaskQueueImpl::TaskRunner::PostDelayedTask](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/task_queue_impl.cc;l=153;drc=4e698e3204c71aa8e4336776abebf6af9c768269).
  7. [TaskQueueImpl::PostTask](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/task_queue_impl.cc;drc=4e698e3204c71aa8e4336776abebf6af9c768269;l=368) calls `PostDelayedTaskImpl`, then [`PushOntoDelayedIncomingQueueFromMainThread`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/task_queue_impl.cc;drc=4e698e3204c71aa8e4336776abebf6af9c768269;l=526) is called.
  8. `UpdateWakeUp`, `SetNextWakeUp`, `WakeUpQueue::SetNextWakeUpForQueue`, [`DefaultWakeUpQueue::OnNextWakeUpChanged`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/wake_up_queue.cc;l=141;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1), [`SequenceManagerImpl::SetNextWakeUp`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/sequence_manager_impl.cc;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1;l=475) are executed in order, and [`ThreadControllerWithMessagePumpImpl::SetNextDelayedDoWork`](https://source.chromium.org/chromium/chromium/src/+/main:base/task/sequence_manager/thread_controller_with_message_pump_impl.cc;l=191;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1) is executed.
  9. The [`ScheduleDelayedWork`](https://source.chromium.org/chromium/chromium/src/+/main:base/message_loop/message_pump.h;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1;l=265) function, which gives the delay time, is implemented for each operating system.
  - [Android](https://source.chromium.org/chromium/chromium/src/+/main:base/message_loop/message_pump_android.cc;l=601;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1): Uses [`timerfd_settime`](https://linux.die.net/man/2/timerfd_settime) system call
  - [macOS](https://source.chromium.org/chromium/chromium/src/+/main:base/message_loop/message_pump_apple.mm;l=185;drc=4e698e3204c71aa8e4336776abebf6af9c768269;bpv=1;bpt=1): Uses `CFRunLoopTimerSetNextFireDate` API
  10. When the timer expires, the callback function registered in setInterval is executed through the process of task queue (work queue) -> RunInternal -> Fired -> execute -> v8 call stack.

