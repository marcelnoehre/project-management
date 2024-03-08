import { TestBed, tick, fakeAsync } from "@angular/core/testing";
import { StatsService } from "./stats.service";
import { ApiService } from "./api/api.service";
import { UserService } from "./user.service";
import { StorageService } from "./storage.service";
import { ErrorService } from "./error.service";
import { TestService } from "./api/test.service";
import { environment } from "src/environments/environment";

describe("StatsService", () => {
  const optimizeOrder = { message: "SUCCESS.STATS.OPTIMIZE" };
  const personalStats = {
    deleted: 1,
    edited: 1,
    created: 3,
    imported: 77,
    restored: 1,
    updated: 20,
    cleared: 1,
    trashed: 9,
  };
  const stats = [
    {
      id: "STATS.PROJECT",
      stats: {
        deleted: 5,
        edited: 4,
        created: 4,
        imported: 104,
        restored: 17,
        updated: 29,
        cleared: 7,
        trashed: 16,
      },
    },
    {
      id: "owner",
      stats: {
        deleted: 1,
        edited: 1,
        created: 3,
        imported: 77,
        restored: 1,
        updated: 20,
        cleared: 1,
        trashed: 9,
      },
    },
    {
      id: "admin",
      stats: {
        deleted: 0,
        edited: 0,
        created: 3,
        imported: 11,
        restored: 7,
        updated: 2,
        cleared: 0,
        trashed: 2,
      },
    },
    {
      id: "member",
      stats: {
        deleted: 1,
        edited: 2,
        created: 3,
        imported: 14,
        restored: 5,
        updated: 7,
        cleared: 6,
        trashed: 4,
      },
    },
    {
      id: "STATS.OTHERS",
      stats: {
        deleted: 3,
        edited: 1,
        created: 5,
        imported: 2,
        restored: 4,
        updated: 0,
        cleared: 0,
        trashed: 1,
      },
    },
  ];
  const statLeaders = {
    created: { username: ["owner", "admin"], value: 3 },
    imported: { username: ["owner"], value: 77 },
    updated: { username: ["admin"], value: 20 },
    edited: { username: ["member"], value: 1 },
    trashed: { username: ["member"], value: 9 },
    restored: { username: ["owner"], value: 1 },
    deleted: { username: ["admin"], value: 2 },
    cleared: { username: ["admin"], value: 1 },
  };
  const taskAmount = {
    NONE: 5,
    TODO: 7,
    PROGRESS: 2,
    REVIEW: 6,
    DONE: 10,
    DELETED: 3,
  };
  const averageTime = {
    NONE: 138785180.7142857,
    TODO: 151694419.625,
    PROGRESS: 161779809,
    REVIEW: 161779452.66666666,
    DONE: 145641722.8,
    DELETED: 0,
  };
  const taskProgress = {
    timestamps: [
      1707706711326, 1707706711547, 1707706711761, 1707706711969, 1707706712166,
      1707706712367, 1707706712566, 1707706712767, 1707706712945, 1707706713118,
      1707706713301, 1707706984404, 1707706984558, 1707706985141, 1707706985455,
      1707706985601, 1707949317400, 1707949317586, 1707949317799, 1707949318000,
      1707949318194, 1707949318388, 1707949318578, 1707949318752, 1707949318942,
      1707949319137, 1707949319299,
    ],
    NONE: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27,
    ],
    TODO: [
      0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 13, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22,
    ],
    PROGRESS: [
      0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6, 7, 8, 9, 9, 9, 9, 9, 9, 10, 11, 12,
      13, 14, 15,
    ],
    REVIEW: [
      0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 8,
      9, 10,
    ],
    DONE: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      4, 5,
    ],
  };
  const projectRoadmap = [
    {
      type: "STATS.PROJECT_ROADMAP.CREATED",
      timestamp: 1707688306528,
      username: "owner",
      target: null,
    },
    {
      type: "STATS.PROJECT_ROADMAP.INVITED",
      timestamp: 1707688391791,
      username: "owner",
      target: "member",
    },
    {
      type: "STATS.PROJECT_ROADMAP.JOINED",
      timestamp: 1707688399967,
      username: "member",
      target: null,
    },
    {
      type: "STATS.PROJECT_ROADMAP.REMOVED",
      timestamp: 1707688526728,
      username: "owner",
      target: "member",
    },
    {
      type: "STATS.PROJECT_ROADMAP.INVITED",
      timestamp: 1707688529525,
      username: "owner",
      target: "admin",
    },
    {
      type: "STATS.PROJECT_ROADMAP.JOINED",
      timestamp: 1707688539092,
      username: "admin",
      target: null,
    },
    {
      type: "STATS.PROJECT_ROADMAP.INVITED",
      timestamp: 1707696589097,
      username: "admin",
      target: "member",
    },
    {
      type: "STATS.PROJECT_ROADMAP.JOINED",
      timestamp: 1707696596223,
      username: "member",
      target: null,
    },
    {
      type: "STATS.PROJECT_ROADMAP.LEFT",
      timestamp: 1707696880346,
      username: "member",
      target: null,
    },
    {
      type: "STATS.PROJECT_ROADMAP.REMOVED",
      timestamp: 1707697212830,
      username: "owner",
      target: "member",
    },
  ];

  let statsService: StatsService;
  let testService: TestService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj("ApiService", [
      "optimizeOrder",
      "personalStats",
      "stats",
      "statLeaders",
      "taskAmount",
      "averageTime",
      "wip",
      "taskProgress",
      "projectRoadmap",
    ]);
    const userSpy = jasmine.createSpyObj("UserService", ["token"]);
    const storageSpy = jasmine.createSpyObj("StorageService", [
      "getSessionEntry",
      "setSessionEntry",
      "deleteSessionEntry",
    ]);
    const errorSpy = jasmine.createSpyObj("ErrorService", ["handleApiError"]);

    TestBed.configureTestingModule({
      providers: [
        StatsService,
        { provide: ApiService, useValue: apiSpy },
        { provide: UserService, useValue: userSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ErrorService, useValue: errorSpy },
      ],
    });

    statsService = TestBed.inject(StatsService);
    testService = TestBed.inject(TestService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    storageServiceSpy = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    errorServiceSpy = TestBed.inject(
      ErrorService
    ) as jasmine.SpyObj<ErrorService>;
  });

  describe("setup", () => {
    it("should be created", () => {
      expect(statsService).toBeTruthy();
    });

    it("should load test environment", () => {
      expect(environment.environement).toBe("test");
    });
  });

  it("should initialize stats from storage if available", fakeAsync(() => {
    storageServiceSpy.getSessionEntry.and.returnValue(true);
    storageServiceSpy.getSessionEntry
      .withArgs("stats")
      .and.returnValue(testService.stats("mock"));

    statsService.init();

    tick(500);

    expect(storageServiceSpy.getSessionEntry).toHaveBeenCalledWith(
      "statsRetrieval"
    );
    expect(storageServiceSpy.getSessionEntry).toHaveBeenCalledWith("stats");
    expect(statsService["_data"]).toEqual({
      optimizeOrder: null,
      personalStats: null,
      stats: null,
      statLeaders: null,
      taskAmount: null,
      averageTime: null,
      wip: null,
      taskProgress: null,
      projectRoadmap: null,
    });
  }));

  it("should fetch and update stats if not available in storage", fakeAsync(() => {
    storageServiceSpy.getSessionEntry.and.returnValue(false);
    apiServiceSpy.optimizeOrder.and.returnValue(
      testService.optimizeOrder("mock")
    );
    apiServiceSpy.personalStats.and.returnValue(
      testService.personalStats("mock")
    );
    apiServiceSpy.stats.and.returnValue(testService.stats("mock"));
    apiServiceSpy.statLeaders.and.returnValue(testService.statLeaders("mock"));
    apiServiceSpy.taskAmount.and.returnValue(testService.taskAmount("mock"));
    apiServiceSpy.averageTime.and.returnValue(testService.averageTime("mock"));
    apiServiceSpy.wip.and.returnValue(testService.wip("mock"));
    apiServiceSpy.taskProgress.and.returnValue(
      testService.taskProgress("mock")
    );
    apiServiceSpy.projectRoadmap.and.returnValue(
      testService.projectRoadmap("mock")
    );
    statsService.init();
    tick(500);
    expect(storageServiceSpy.getSessionEntry).toHaveBeenCalledWith(
      "statsRetrieval"
    );
    expect(apiServiceSpy.optimizeOrder).toHaveBeenCalled();
    expect(apiServiceSpy.personalStats).toHaveBeenCalled();
    expect(apiServiceSpy.stats).toHaveBeenCalled();
    expect(apiServiceSpy.statLeaders).toHaveBeenCalled();
    expect(apiServiceSpy.taskAmount).toHaveBeenCalled();
    expect(apiServiceSpy.averageTime).toHaveBeenCalled();
    expect(apiServiceSpy.wip).toHaveBeenCalled();
    expect(apiServiceSpy.taskProgress).toHaveBeenCalled();
    expect(apiServiceSpy.projectRoadmap).toHaveBeenCalled();
    expect(statsService["_data"]).toEqual({
      optimizeOrder: optimizeOrder,
      personalStats: personalStats,
      stats: stats,
      statLeaders: statLeaders,
      taskAmount: taskAmount,
      averageTime: averageTime,
      wip: 2,
      taskProgress: taskProgress,
      projectRoadmap: projectRoadmap,
    });
  }));

  it("should handle errors during API calls", fakeAsync(() => {
    storageServiceSpy.getSessionEntry.and.returnValue(false);

    // Mock API errors
    apiServiceSpy.optimizeOrder.and.throwError("Mock Error");
    statsService.init();
    tick(500);
    expect(storageServiceSpy.getSessionEntry).toHaveBeenCalledWith(
      "statsRetrieval"
    );
    expect(apiServiceSpy.optimizeOrder).toHaveBeenCalled();
    expect(errorServiceSpy.handleApiError).toHaveBeenCalled();
    expect(statsService["_data"]).toEqual({
      optimizeOrder: null,
      personalStats: null,
      stats: null,
      statLeaders: null,
      taskAmount: null,
      averageTime: null,
      wip: null,
      taskProgress: null,
      projectRoadmap: null,
    });
  }));

  it("should regenerate stats", fakeAsync(() => {
    storageServiceSpy.getSessionEntry.and.returnValue(true);
    statsService.regenerateAll();
    tick(500);
    expect(storageServiceSpy.deleteSessionEntry).toHaveBeenCalledWith("stats");
    expect(storageServiceSpy.deleteSessionEntry).toHaveBeenCalledWith(
      "statsRetrieval"
    );
    expect(statsService["_data"]).toEqual({
      optimizeOrder: null,
      personalStats: null,
      stats: null,
      statLeaders: null,
      taskAmount: null,
      averageTime: null,
      wip: null,
      taskProgress: null,
      projectRoadmap: null,
    });
  }));

  it("should regenerate a specific stat", fakeAsync(() => {
    apiServiceSpy.stats.and.returnValue(testService.stats("mock"));
    statsService.regenerateStat("stats");
    tick(500);
    expect(apiServiceSpy.stats).toHaveBeenCalled();
    expect(statsService["_data"].stats).toEqual(stats);
  }));

  it("should handle errors during specific stat regeneration", fakeAsync(() => {
    apiServiceSpy.stats.and.throwError("Mock Error");
    statsService.regenerateStat("stats");
    tick(500);
    expect(apiServiceSpy.stats).toHaveBeenCalled();
    expect(errorServiceSpy.handleApiError).toHaveBeenCalled();
    expect(statsService["_data"].stats).toBeNull();
  }));
});
