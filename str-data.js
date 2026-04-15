window.STR_AUTO_DATA = `
=== ANALYZING ARCHITECTURE: C:\\Jansky-Design\\2026\\Nexus\\Web ===

[DIR] ROOT\\.trae

[DIR] ROOT\\components

[DIR] ROOT\\context

[DIR] ROOT\\modules

[DIR] ROOT\\server

[DIR] ROOT\\services

[DIR] ROOT\\utils
  FILE: \\.env (61 lines)
  FILE: \\.env.example (23 lines)
  FILE: \\.gitignore (25 lines)
  FILE: \\App.tsx (688 lines)
    [SOCKET]  emit: join_user, on: connect, on: call_invite, on: call_ended, on: call_established, on: call_user_joined
    [EXPORTS]  App
    [IMPORTS]  react, react-router-dom, ./components/Layout, ./context/DbContext, ./services/api, ./services/socket, ./types, ./modules/Files/context/ExplorerContext, ./modules/Files/components/Lightbox, ./modules/Files/components/Modals, ./modules/Files/components/CommandPalette, ./components/Dashboard, ./modules/Projects/Projects, ./modules/Profile/Profile, ./modules/Files/FileExplorer, ./modules/Chat/ChatWorkspace, ./modules/Personal/PersonalWorkspace, ./modules/Projects/components/ProjectDetail/ProjectFinances, ./modules/Admin/AdminPanel, ./modules/Files/PublicSharePage, ./components/LoginScreen
  FILE: \\index.html (110 lines)
  FILE: \\index.tsx (22 lines)
    [IMPORTS]  react, react-dom/client, ./App, ./context/DbContext, react-router-dom
  FILE: \\metadata.json (5 lines)
  FILE: \\package.json (65 lines)
  FILE: \\README.md (21 lines)
  FILE: \\seed.ts (272 lines)
    [IMPORTS]  ./server/db.js, bcrypt, dotenv, uuid
  FILE: \\server.ts (442 lines)
    [ROUTES]  [USE] /api/auth -> authRoutes  [USE] /api/files -> fileRoutes  [USE] /api/users -> userRoutes  [USE] /api/projects -> projectRoutes  [USE] /api/kanban -> kanbanRoutes  [USE] /api/canvas -> canvasRoutes  [USE] /api/chat -> chatRoutes  [USE] /api/finances -> financeRoutes  [USE] /api/admin -> adminRoutes  [USE] /api/notifications -> notificationRoutes  [USE] /api/company -> companyRoutes  [GET] /api/health  [GET] /*all
    [SOCKET]  emit: call_presence, emit: call_ended, on: connection, on: join_user, on: join_room, on: leave_room, on: send_message, emit: receive_message, on: call_create, emit: call_error, emit: call_invite, on: call_join, emit: call_not_found, emit: call_established, emit: call_participants, emit: call_user_joined, on: call_leave, emit: call_user_left, on: call_signal, emit: call_signal, on: canvas_update, emit: canvas_update, on: kanban_update, emit: kanban_update, on: disconnect, on: finish
    [IMPORTS]  express, vite, path, cors, cookie-parser, dotenv, http, socket.io, ./server/auth/routes.js, ./server/files/routes.js, ./server/users/routes.js, ./server/projects/routes.js, ./server/kanban/routes.js, ./server/canvas/routes.js, ./server/chat/routes.js, ./server/finances/routes.js, ./server/admin/routes.js, ./server/notifications/routes.js, ./server/company/routes.js, ./server/db.js
  FILE: \\tsconfig.json (34 lines)
  FILE: \\tsgsa.md (715 lines)
  FILE: \\types.ts (408 lines)
    [TYPES ]  Role, UserPreferences, User, SecurityConfig, BreadcrumbItem, FileHistory, PublicLink, FileItem, AutomationAction, AutomationRule, PriorityDef, KanbanBoardSettings, KanbanBoard, ProjectPermissions, CustomRole, Team, PermissionAuditLog, ProjectRole, ProjectMember, Project, KanbanColumn, SubTask, TaskComment, KanbanTask, TimelineEvent, WhiteboardItem, Whiteboard, SortOption, SortDirection, GroupOption, ChatMessage, Chat, Transaction, Bill, EmployeeSalary, TaxLiability
    [IMPORTS]  ./modules/Notifications/types
  FILE: \\vite.config.ts (24 lines)
    [EXPORTS]  defineConfig
    [IMPORTS]  path, vite, @vitejs/plugin-react

[DIR] ROOT\\components\\ui
  FILE: \\components\\Dashboard.tsx (486 lines)
    [TYPES ]  DashboardProps
    [EXPORTS]  Dashboard
    [IMPORTS]  react, lucide-react, ./ui/Button, ../context/DbContext, ../utils/formatters, ../types
  FILE: \\components\\Layout.tsx (729 lines)
    [TYPES ]  LayoutProps
    [EXPORTS]  Layout
    [IMPORTS]  react, lucide-react, ../types, ../modules/Files/hooks/useFileActions, ../modules/Files/context/ExplorerContext, ./ui/Modal, ./ui/Button, ../modules/Files/utils, ../modules/Files/components/FileContextMenu, ../modules/Notifications, react-router-dom
  FILE: \\components\\LoginScreen.tsx (234 lines)
    [TYPES ]  LoginScreenProps
    [EXPORTS]  LoginScreen
    [IMPORTS]  react, ../services/api, ../types
  FILE: \\components\\ui\\Button.tsx (38 lines)
    [TYPES ]  ButtonProps
    [EXPORTS]  Button
    [IMPORTS]  react
  FILE: \\components\\ui\\Modal.tsx (32 lines)
    [TYPES ]  ModalProps
    [EXPORTS]  Modal
    [IMPORTS]  react, lucide-react
  FILE: \\context\\DbContext.tsx (73 lines)
    [STATE ]  DbContext
    [TYPES ]  DbState
    [EXPORTS]  DbProvider, useDb
    [IMPORTS]  react, ../services/api, ../types

[DIR] ROOT\\modules\\Admin

[DIR] ROOT\\modules\\Chat

[DIR] ROOT\\modules\\Files

[DIR] ROOT\\modules\\Notifications

[DIR] ROOT\\modules\\Personal

[DIR] ROOT\\modules\\Profile

[DIR] ROOT\\modules\\Projects

[DIR] ROOT\\modules\\Whiteboard
  FILE: \\modules\\Admin\\AdminPanel.tsx (446 lines)
    [EXPORTS]  AdminPanel
    [IMPORTS]  react, ../../types, ../../context/DbContext, ../../services/api, ../../components/ui/Button, lucide-react, ../Files/utils

[DIR] ROOT\\modules\\Chat\\components
  FILE: \\modules\\Chat\\ChatWorkspace.tsx (927 lines)
    [SOCKET]  emit: join_room, emit: leave_room, on: receive_message, on: call_ended, on: call_presence, on: call_error, emit: send_message, emit: call_create
    [TYPES ]  ChatWorkspaceProps
    [EXPORTS]  ChatWorkspace
    [IMPORTS]  react, ../Files/context/ExplorerContext, ../../context/DbContext, ../../services/api, ../../types, ../../components/ui/Button, ../../components/ui/Modal, lucide-react, ./components/ChatInput, ./components/ChatInfo, ./components/MessageList, ../../services/socket, ./components/CallOverlay, ../Notifications, ../Files/components/EditorView
  FILE: \\modules\\Chat\\data.ts (91 lines)
    [EXPORTS]  EMOJI_CATEGORIES, searchEmojis, MOCK_GIFS
  FILE: \\modules\\Chat\\components\\CallOverlay.tsx (714 lines)
    [SOCKET]  emit: call_signal, emit: call_join, on: call_participants, on: call_user_joined, on: call_user_left, on: call_signal, on: call_established, on: call_ended, on: call_not_found, emit: call_leave
    [TYPES ]  CallKind, CallSignal
    [EXPORTS]  CallOverlay
    [IMPORTS]  react, lucide-react, ../../../components/ui/Button, ../../../services/socket, ../../../types
  FILE: \\modules\\Chat\\components\\ChatFilePicker.tsx (102 lines)
    [TYPES ]  ChatFilePickerProps
    [EXPORTS]  ChatFilePicker
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../components/ui/Button, lucide-react, ../../Files/context/ExplorerContext, ../../../types, ../../Files/utils
  FILE: \\modules\\Chat\\components\\ChatInfo.tsx (100 lines)
    [TYPES ]  ChatInfoProps
    [EXPORTS]  ChatInfo
    [IMPORTS]  react, ../../../types, lucide-react
  FILE: \\modules\\Chat\\components\\ChatInput.tsx (519 lines)
    [TYPES ]  ChatInputProps, GifResult, as
    [EXPORTS]  ChatInput
    [IMPORTS]  react, lucide-react, ../../../types, ../data, ../../Files/utils, ./ChatFilePicker, ./CreatePollModal
  FILE: \\modules\\Chat\\components\\CreatePollModal.tsx (193 lines)
    [TYPES ]  CreatePollModalProps
    [EXPORTS]  CreatePollModal
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../components/ui/Button, lucide-react
  FILE: \\modules\\Chat\\components\\MessageList.tsx (679 lines)
    [TYPES ]  Attachment, MessageItemProps, MessageListProps
    [EXPORTS]  MessageList
    [IMPORTS]  react, ../../../types, ../../Files/components/MarkdownLinePreview, lucide-react, ../../Files/utils, ../../Files/hooks/useFileContent, ./PollMessage, ../../../components/ui/Modal, ../../../components/ui/Button
  FILE: \\modules\\Chat\\components\\PollMessage.tsx (274 lines)
    [TYPES ]  PollData, PollMessageProps
    [EXPORTS]  PollMessage
    [IMPORTS]  react, ../../../types, lucide-react

[DIR] ROOT\\modules\\Files\\components

[DIR] ROOT\\modules\\Files\\context

[DIR] ROOT\\modules\\Files\\hooks
  FILE: \\modules\\Files\\constants.ts (6 lines)
    [EXPORTS]  IGNORED_PATHS, PREVIEW_SIZE_LIMIT, SMALL_FILE_LIMIT, MEDIUM_FILE_LIMIT
  FILE: \\modules\\Files\\FileExplorer.tsx (365 lines)
    [TYPES ]  FileExplorerProps
    [EXPORTS]  FileExplorer
    [IMPORTS]  react, ../../types, ./context/ExplorerContext, ./hooks/useFileUpload, ./hooks/useFileActions, ./components/Toolbar, ./components/Sidebar, ./components/FileGrid, ./components/FileList, ./components/DetailsPane, ./components/EditorView, ./components/FileContextMenu, ./components/GeneralContextMenu, lucide-react
  FILE: \\modules\\Files\\PublicSharePage.tsx (375 lines)
    [TYPES ]  FolderOption, as
    [EXPORTS]  PublicSharePage
    [IMPORTS]  react, react-router-dom, lucide-react, ../../components/ui/Modal, ../../components/ui/Button
  FILE: \\modules\\Files\\simplePsd.ts (517 lines)
    [TYPES ]  BlendMode, PsdAdjustment, PsdLayer, PsdResult
    [EXPORTS]  readPsdDimensions, parsePsd
  FILE: \\modules\\Files\\utils.tsx (316 lines)
    [TYPES ]  DiffLine
    [EXPORTS]  computeLineDiff, resolveFile, getFileBuffer, getFileIcon, getFileColorStyles, FOLDER_COLORS, getRandomFolderColor, getDeterministicFolderColor, getTagColor, formatSize, determineFileType, dataURLToArrayBuffer, computeChecksum, normalizeModel
    [IMPORTS]  react, ../../types, lucide-react, three

[DIR] ROOT\\modules\\Files\\components\\details

[DIR] ROOT\\modules\\Files\\components\\markdown
  FILE: \\modules\\Files\\components\\CodeEditor.tsx (156 lines)
    [TYPES ]  CodeEditorProps
    [EXPORTS]  CodeEditor
    [IMPORTS]  react, prismjs, https://esm.sh/prismjs@1.29.0/components/prism-javascript.min.js, https://esm.sh/prismjs@1.29.0/components/prism-typescript.min.js, https://esm.sh/prismjs@1.29.0/components/prism-css.min.js, https://esm.sh/prismjs@1.29.0/components/prism-json.min.js, https://esm.sh/prismjs@1.29.0/components/prism-python.min.js, https://esm.sh/prismjs@1.29.0/components/prism-markup.min.js
  FILE: \\modules\\Files\\components\\CommandPalette.tsx (292 lines)
    [EXPORTS]  CommandPalette
    [IMPORTS]  react, ../context/ExplorerContext, ../utils, lucide-react, ../../../types, ../../../context/DbContext
  FILE: \\modules\\Files\\components\\DetailsPane.tsx (198 lines)
    [EXPORTS]  DetailsPane
    [IMPORTS]  react, ../context/ExplorerContext, ../hooks/useFileActions, ../hooks/useFileFilter, ../utils, ../../../components/ui/Button, lucide-react, ../../../types, ./details/DetailMultiSelect, ./details/DetailInfo, ./details/DetailHistory, ./details/DetailSharing, ../hooks/useFileContent, ./ThreeModelViewer, ./PdfViewer
  FILE: \\modules\\Files\\components\\EditorView.tsx (253 lines)
    [EXPORTS]  EditorView
    [IMPORTS]  react, ../context/ExplorerContext, ../../../components/ui/Button, lucide-react, ./MarkdownEditor, ./CodeEditor, ../utils, ../hooks/useFileContent, ../hooks/useFileActions, ../../Whiteboard/Whiteboard, ../../Projects/components/Kanban/KanbanContext, ../../Projects/components/Kanban/BoardView, ../../../types
  FILE: \\modules\\Files\\components\\FileContextMenu.tsx (213 lines)
    [TYPES ]  ContextMenuProps
    [EXPORTS]  FileContextMenu
    [IMPORTS]  react, ../../../types, ../utils, lucide-react, ../context/ExplorerContext, ../hooks/useFileActions
  FILE: \\modules\\Files\\components\\FileGrid.tsx (57 lines)
    [EXPORTS]  FileGrid
    [IMPORTS]  react, ../context/ExplorerContext, ../hooks/useFileFilter, ./FileGridItem, lucide-react
  FILE: \\modules\\Files\\components\\FileGridItem.tsx (283 lines)
    [EXPORTS]  FileGridItem
    [IMPORTS]  react, ../../../types, ../context/ExplorerContext, ../hooks/useFileActions, ../hooks/useFileUpload, ../hooks/useFileFilter, ../hooks/useFileContent, ../utils, ../constants, ./ThreeModelViewer, ./PdfViewer, lucide-react, ../simplePsd
  FILE: \\modules\\Files\\components\\FileList.tsx (51 lines)
    [EXPORTS]  FileList
    [IMPORTS]  react, ../context/ExplorerContext, ../hooks/useFileFilter, ./FileListItem, lucide-react
  FILE: \\modules\\Files\\components\\FileListItem.tsx (144 lines)
    [EXPORTS]  FileListItem
    [IMPORTS]  react, ../../../types, ../context/ExplorerContext, ../hooks/useFileActions, ../hooks/useFileUpload, ../hooks/useFileFilter, ../utils, lucide-react, ../hooks/useFileContent, ../constants
  FILE: \\modules\\Files\\components\\FolderTree.tsx (178 lines)
    [TYPES ]  FolderTreeItemProps
    [EXPORTS]  FolderTreeItem
    [IMPORTS]  react, ../../../types, lucide-react
  FILE: \\modules\\Files\\components\\GeneralContextMenu.tsx (167 lines)
    [TYPES ]  Props
    [EXPORTS]  GeneralContextMenu
    [IMPORTS]  react, ../context/ExplorerContext, ../hooks/useFileActions, lucide-react, ../../../types
  FILE: \\modules\\Files\\components\\ImageToolsModal.tsx (825 lines)
    [TYPES ]  ImageToolsModalProps, SingleImageEditorProps
    [EXPORTS]  ImageToolsModal
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../components/ui/Button, ../../../types, lucide-react, ../utils, ../context/ExplorerContext, ../hooks/useFileContent, ../simplePsd
  FILE: \\modules\\Files\\components\\ImageViewer.tsx (241 lines)
    [TYPES ]  ImageViewerProps
    [EXPORTS]  ImageViewer
    [IMPORTS]  react, lucide-react, ../../../components/ui/Button
  FILE: \\modules\\Files\\components\\Lightbox.tsx (278 lines)
    [TYPES ]  as
    [EXPORTS]  Lightbox
    [IMPORTS]  react, ../context/ExplorerContext, ../utils, ./ThreeModelViewer, ./MediaPlayer, ./ImageViewer, ./PsdViewer, ./SvgViewer, ./ZipLayerViewer, ./PdfViewer, ../../../components/ui/Button, lucide-react, ../hooks/useFileContent, heic2any, utif
  FILE: \\modules\\Files\\components\\LiveEditor.tsx (87 lines)
    [EXPORTS]  LiveMarkdownEditor
    [IMPORTS]  react
  FILE: \\modules\\Files\\components\\MarkdownEditor.tsx (309 lines)
    [TYPES ]  MarkdownEditorProps
    [EXPORTS]  MarkdownEditor
    [IMPORTS]  react, lucide-react, ../../../types, ./MarkdownLinePreview, ../hooks/useMarkdownLogic, ./markdown/MarkdownToolbar, ./markdown/MarkdownModals
  FILE: \\modules\\Files\\components\\MarkdownLinePreview.tsx (353 lines)
    [TYPES ]  ResolvedImageProps, LinePreviewProps
    [EXPORTS]  LinePreview
    [IMPORTS]  react, lucide-react, ../../../types, ../hooks/useFileContent
  FILE: \\modules\\Files\\components\\MediaPlayer.tsx (29 lines)
    [EXPORTS]  MediaPlayer
    [IMPORTS]  react, lucide-react
  FILE: \\modules\\Files\\components\\Modals.tsx (227 lines)
    [EXPORTS]  ExplorerModals
    [IMPORTS]  react, ../context/ExplorerContext, ../hooks/useFileActions, ../../../components/ui/Modal, ../../../components/ui/Button, lucide-react, ../../../types, ./PdfToolsModal, ./ImageToolsModal, ../../Projects/components/Kanban/BoardSettingsModal, ./ShareModal
  FILE: \\modules\\Files\\components\\OrientationGizmo.tsx (126 lines)
    [TYPES ]  OrientationGizmoProps
    [EXPORTS]  OrientationGizmo
    [IMPORTS]  react, three, three/examples/jsm/controls/OrbitControls.js
  FILE: \\modules\\Files\\components\\PdfToolsModal.tsx (270 lines)
    [TYPES ]  PdfToolsModalProps
    [EXPORTS]  PdfToolsModal
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../components/ui/Button, ../../../types, lucide-react, pdf-lib, ../utils, ../context/ExplorerContext
  FILE: \\modules\\Files\\components\\PdfViewer.tsx (155 lines)
    [TYPES ]  PdfViewerProps
    [EXPORTS]  PdfThumbnail, PdfViewer
    [IMPORTS]  react, react-pdf, ../../../components/ui/Button, lucide-react, react-pdf/dist/Page/AnnotationLayer.css, react-pdf/dist/Page/TextLayer.css
  FILE: \\modules\\Files\\components\\PsdViewer.tsx (741 lines)
    [TYPES ]  PsdViewerProps
    [EXPORTS]  PsdViewer
    [IMPORTS]  react, ../../../components/ui/Button, lucide-react, ../utils, ../simplePsd
  FILE: \\modules\\Files\\components\\ShareModal.tsx (26 lines)
    [EXPORTS]  ShareModal
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../components/ui/Button, ../../../types, ../context/ExplorerContext, ../utils, ./details/DetailSharing
  FILE: \\modules\\Files\\components\\Sidebar.tsx (375 lines)
    [EXPORTS]  Sidebar
    [IMPORTS]  react, lucide-react, ../context/ExplorerContext, ../hooks/useFileUpload, ./FolderTree, ../../../types
  FILE: \\modules\\Files\\components\\SvgViewer.tsx (146 lines)
    [TYPES ]  SvgViewerProps, SvgElementInfo
    [EXPORTS]  SvgViewer
    [IMPORTS]  react, ../../../components/ui/Button, lucide-react
  FILE: \\modules\\Files\\components\\ThreeModelViewer.tsx (815 lines)
    [TYPES ]  ThreeModelViewerProps, TextureMapState
    [EXPORTS]  ThreeModelViewer
    [IMPORTS]  react, three, three/examples/jsm/controls/OrbitControls.js, three/examples/jsm/loaders/GLTFLoader.js, three/examples/jsm/loaders/DRACOLoader.js, three/examples/jsm/loaders/OBJLoader.js, three/examples/jsm/loaders/STLLoader.js, three/examples/jsm/loaders/FBXLoader.js, ./OrientationGizmo, ../utils, ../../../types, lucide-react
  FILE: \\modules\\Files\\components\\Toolbar.tsx (159 lines)
    [TYPES ]  ToolbarProps
    [EXPORTS]  Toolbar
    [IMPORTS]  react, lucide-react, ../../../components/ui/Button, ../context/ExplorerContext, ../hooks/useFileFilter
  FILE: \\modules\\Files\\components\\ZipLayerViewer.tsx (316 lines)
    [TYPES ]  ZipLayer, ZipViewerProps
    [EXPORTS]  ZipLayerViewer
    [IMPORTS]  react, jszip, ../../../components/ui/Button, lucide-react
  FILE: \\modules\\Files\\components\\details\\DetailHistory.tsx (181 lines)
    [EXPORTS]  DetailHistory
    [IMPORTS]  react, ../../context/ExplorerContext, ../../hooks/useFileActions, ../../utils, ../../../../types, ../../../../components/ui/Button, lucide-react, ../../../../context/DbContext
  FILE: \\modules\\Files\\components\\details\\DetailInfo.tsx (291 lines)
    [EXPORTS]  DetailInfo
    [IMPORTS]  react, ../../context/ExplorerContext, ../../hooks/useFileActions, ../../hooks/useFileFilter, ../../utils, ../../simplePsd, ../../../../types, ../../../../components/ui/Button, lucide-react, ../../../../context/DbContext
  FILE: \\modules\\Files\\components\\details\\DetailMultiSelect.tsx (177 lines)
    [EXPORTS]  DetailMultiSelect
    [IMPORTS]  react, ../../context/ExplorerContext, ../../hooks/useFileActions, ../../hooks/useFileFilter, ../../utils, ../../../../components/ui/Button, lucide-react
  FILE: \\modules\\Files\\components\\details\\DetailSharing.tsx (570 lines)
    [EXPORTS]  DetailSharing
    [IMPORTS]  react, ../../context/ExplorerContext, ../../hooks/useFileActions, ../../../../types, ../../../../components/ui/Button, lucide-react, ../../../../context/DbContext
  FILE: \\modules\\Files\\components\\markdown\\MarkdownModals.tsx (551 lines)
    [TYPES ]  MarkdownModalsProps
    [EXPORTS]  MarkdownModals
    [IMPORTS]  react, ../../../../components/ui/Modal, ../../../../components/ui/Button, ../../../../types, lucide-react, ../../utils, ../../simplePsd
  FILE: \\modules\\Files\\components\\markdown\\MarkdownToolbar.tsx (75 lines)
    [TYPES ]  MarkdownToolbarProps
    [EXPORTS]  MarkdownToolbar
    [IMPORTS]  react, lucide-react, ../../../../components/ui/Button
  FILE: \\modules\\Files\\context\\ExplorerContext.tsx (490 lines)
    [STATE ]  ExplorerContext
    [TYPES ]  DeletePromptState, ToastMessage, DateFilterOption, SharingFilterOption, ExplorerState, activeDateFilter, ExplorerActions
    [EXPORTS]  ExplorerProvider, useExplorer
    [IMPORTS]  react, ../../../types, ../../../services/api, ../../../context/DbContext, ../utils
  FILE: \\modules\\Files\\hooks\\useFileActions.ts (1129 lines)
    [TYPES ]  ImageProcessOptions
    [EXPORTS]  useFileActions
    [IMPORTS]  react, ../../../types, ../context/ExplorerContext, ../../../services/api, ../utils, jszip, pdf-lib, react-pdf, ../simplePsd
  FILE: \\modules\\Files\\hooks\\useFileContent.ts (143 lines)
    [EXPORTS]  useFileContent
    [IMPORTS]  react, ../../../types, ../context/ExplorerContext, ../utils
  FILE: \\modules\\Files\\hooks\\useFileFilter.ts (347 lines)
    [TYPES ]  of
    [EXPORTS]  useFileFilter
    [IMPORTS]  react, ../context/ExplorerContext, ../../../types
  FILE: \\modules\\Files\\hooks\\useFileUpload.ts (350 lines)
    [EXPORTS]  useFileUpload
    [IMPORTS]  react, ../../../types, ../context/ExplorerContext, ../constants, ../utils, ../../../services/api
  FILE: \\modules\\Files\\hooks\\useMarkdownLogic.ts (493 lines)
    [SOCKET]  emit: join_file, emit: leave_file, on: md_presence, on: md_cursor, on: md_op, emit: md_op, emit: md_cursor
    [TYPES ]  Collaborator, MarkdownOp
    [EXPORTS]  useMarkdownLogic
    [IMPORTS]  react, ../../../services/socket

[DIR] ROOT\\modules\\Notifications\\components
  FILE: \\modules\\Notifications\\hooks.ts (79 lines)
    [SOCKET]  emit: join_user, on: new_notification
    [EXPORTS]  useNotifications
    [IMPORTS]  react, ./types, ./service, socket.io-client
  FILE: \\modules\\Notifications\\index.ts (6 lines)
    [IMPORTS]  ./types, ./service, ./hooks, ./NotificationCenter
  FILE: \\modules\\Notifications\\NotificationCenter.tsx (129 lines)
    [TYPES ]  NotificationCenterProps
    [EXPORTS]  NotificationCenter
    [IMPORTS]  react, lucide-react, framer-motion, ../../types, ./hooks, ./components/NotificationHeader, ./components/NotificationList, ../../services/api
  FILE: \\modules\\Notifications\\service.ts (67 lines)
    [EXPORTS]  notificationService
    [IMPORTS]  ../../services/api, ./types
  FILE: \\modules\\Notifications\\types.ts (38 lines)
    [TYPES ]  NotificationType, Notification, NotificationRule
  FILE: \\modules\\Notifications\\components\\NotificationHeader.tsx (50 lines)
    [TYPES ]  NotificationHeaderProps
    [EXPORTS]  NotificationHeader
    [IMPORTS]  react, lucide-react
  FILE: \\modules\\Notifications\\components\\NotificationItem.tsx (147 lines)
    [TYPES ]  NotificationItemProps
    [EXPORTS]  NotificationItem
    [IMPORTS]  react, lucide-react, ../types
  FILE: \\modules\\Notifications\\components\\NotificationList.tsx (50 lines)
    [TYPES ]  NotificationListProps
    [EXPORTS]  NotificationList
    [IMPORTS]  react, lucide-react, ../types, ./NotificationItem
  FILE: \\modules\\Personal\\PersonalFileManager.tsx (166 lines)
    [TYPES ]  PersonalFileManagerProps
    [EXPORTS]  PersonalFileManager
    [IMPORTS]  react, ../../components/ui/Button, lucide-react, ../../types, ../Files/hooks/useFileActions, ../Projects/components/CreateFileModal, ../Files/context/ExplorerContext
  FILE: \\modules\\Personal\\PersonalWorkspace.tsx (203 lines)
    [TYPES ]  PersonalWorkspaceProps
    [EXPORTS]  PersonalWorkspace
    [IMPORTS]  react, ../Files/context/ExplorerContext, ./PersonalFileManager, ../Projects/components/ProjectDetail/ProjectKanban, ../Whiteboard/Whiteboard, ../../types, ../../components/ui/Button, ../Files/components/FileContextMenu, ../Files/hooks/useFileActions

[DIR] ROOT\\modules\\Profile\\components
  FILE: \\modules\\Profile\\Profile.tsx (135 lines)
    [TYPES ]  ProfileProps, Tab
    [EXPORTS]  Profile
    [IMPORTS]  react, ../../types, ../../context/DbContext, ../../services/api, lucide-react, ./components/OverviewTab, ./components/ProfileSettings, ./components/SecurityTab
  FILE: \\modules\\Profile\\components\\OverviewTab.tsx (121 lines)
    [TYPES ]  OverviewTabProps
    [EXPORTS]  OverviewTab
    [IMPORTS]  react, ../../../types, lucide-react
  FILE: \\modules\\Profile\\components\\ProfileSettings.tsx (474 lines)
    [TYPES ]  SettingsProps
    [EXPORTS]  AVATAR_STYLES, ACCENT_COLORS, SettingsTab, AppearanceTab
    [IMPORTS]  react, ../../../types, lucide-react, ../../../components/ui/Button
  FILE: \\modules\\Profile\\components\\SecurityTab.tsx (380 lines)
    [TYPES ]  SecurityTabProps
    [EXPORTS]  SecurityTab
    [IMPORTS]  react, ../../../types, lucide-react, ../../../components/ui/Button, ../../../components/ui/Modal

[DIR] ROOT\\modules\\Projects\\components

[DIR] ROOT\\modules\\Projects\\hooks
  FILE: \\modules\\Projects\\Projects.tsx (564 lines)
    [TYPES ]  ProjectsProps, but
    [EXPORTS]  Projects
    [IMPORTS]  react, ../../context/DbContext, ../../services/api, ../../types, ../Files/FileExplorer, ../Whiteboard/Whiteboard, ../../components/ui/Button, lucide-react, ../Files/hooks/useFileActions, ../Files/context/ExplorerContext, ../Files/components/FileContextMenu, ./components/ProjectList, ./components/ProjectWizard, ./components/ProjectDetail/ProjectHeader, ./components/ProjectDetail/ProjectOverview, ./components/ProjectDetail/ProjectKanban, ./components/ProjectDetail/ProjectTeam, ./components/ProjectDetail/ProjectSettings, ./components/ProjectDetail/ProjectFinances, ./components/CreateFileModal

[DIR] ROOT\\modules\\Projects\\components\\Kanban

[DIR] ROOT\\modules\\Projects\\components\\ProjectDetail
  FILE: \\modules\\Projects\\components\\CreateFileModal.tsx (163 lines)
    [TYPES ]  CreateFileModalProps
    [EXPORTS]  CreateFileModal
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../components/ui/Button, ../../../types, lucide-react
  FILE: \\modules\\Projects\\components\\PermissionHelpers.tsx (44 lines)
    [EXPORTS]  PermissionToggle, PermissionGroup
    [IMPORTS]  react
  FILE: \\modules\\Projects\\components\\ProjectList.tsx (104 lines)
    [TYPES ]  ProjectListProps
    [EXPORTS]  ProjectList
    [IMPORTS]  react, ../../../types, ../../../components/ui/Button, lucide-react
  FILE: \\modules\\Projects\\components\\ProjectSettingsModal.tsx (0 lines)
  FILE: \\modules\\Projects\\components\\ProjectWizard.tsx (521 lines)
    [TYPES ]  ProjectWizardProps
    [EXPORTS]  ProjectWizard
    [IMPORTS]  react, ../../../types, ../../../components/ui/Button, lucide-react, ./PermissionHelpers, ../../../context/DbContext
  FILE: \\modules\\Projects\\components\\Kanban\\BoardSettingsModal.tsx (849 lines)
    [TYPES ]  BoardSettingsModalProps, SelectOption
    [EXPORTS]  BoardSettingsModal
    [IMPORTS]  react, ../../../../components/ui/Modal, ../../../../components/ui/Button, ../../../../types, lucide-react, ../../../Files/context/ExplorerContext
  FILE: \\modules\\Projects\\components\\Kanban\\BoardView.tsx (222 lines)
    [TYPES ]  BoardViewProps
    [EXPORTS]  BoardView
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, ../../../../components/ui/Modal, lucide-react, ./KanbanContext, ./KanbanColumn, ./TaskDetailModal
  FILE: \\modules\\Projects\\components\\Kanban\\KanbanCard.tsx (227 lines)
    [TYPES ]  KanbanCardProps
    [EXPORTS]  KanbanCard
    [IMPORTS]  react, ../../../../types, ./KanbanContext, lucide-react, ../../../Files/hooks/useFileContent
  FILE: \\modules\\Projects\\components\\Kanban\\KanbanColumn.tsx (464 lines)
    [TYPES ]  KanbanColumnProps
    [EXPORTS]  KanbanColumn
    [IMPORTS]  react, ../../../../types, ./KanbanContext, ./KanbanCard, lucide-react, ../../../../components/ui/Button, ../../../../components/ui/Modal
  FILE: \\modules\\Projects\\components\\Kanban\\KanbanContext.tsx (347 lines)
    [SOCKET]  emit: join_room, on: kanban_update, emit: leave_room, emit: kanban_update
    [STATE ]  KanbanContext
    [TYPES ]  DragInfo, DropTarget, KanbanContextType, KanbanProviderProps
    [EXPORTS]  KanbanProvider, useKanban
    [IMPORTS]  react, ../../../../types, ../../../Files/context/ExplorerContext, ../../../../services/socket
  FILE: \\modules\\Projects\\components\\Kanban\\TaskDetailModal.tsx (947 lines)
    [TYPES ]  TaskDetailModalProps
    [EXPORTS]  TaskDetailModal
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, lucide-react, ../../../Files/utils, ../../../Files/hooks/useFileUpload, ../../../Files/context/ExplorerContext, ./KanbanContext, ../../../../components/ui/Modal, ../../../Files/hooks/useFileContent, ../../../Notifications
  FILE: \\modules\\Projects\\components\\ProjectDetail\\ProjectFinances.tsx (840 lines)
    [TYPES ]  ProjectFinancesProps
    [EXPORTS]  ProjectFinances
    [IMPORTS]  react, lucide-react, ../../../../components/ui/Button, ../../hooks/useFinances, ../../../../types
  FILE: \\modules\\Projects\\components\\ProjectDetail\\ProjectHeader.tsx (79 lines)
    [TYPES ]  ProjectHeaderProps
    [EXPORTS]  ProjectHeader
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, lucide-react
  FILE: \\modules\\Projects\\components\\ProjectDetail\\ProjectKanban.tsx (302 lines)
    [TYPES ]  ProjectKanbanProps
    [EXPORTS]  ProjectKanban
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, lucide-react, ../Kanban/KanbanContext, ../Kanban/BoardView, ../../../Files/context/ExplorerContext, ../../../Files/components/FileContextMenu, ../../../Files/hooks/useFileActions
  FILE: \\modules\\Projects\\components\\ProjectDetail\\ProjectOverview.tsx (152 lines)
    [TYPES ]  ProjectOverviewProps
    [EXPORTS]  ProjectOverview
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, lucide-react
  FILE: \\modules\\Projects\\components\\ProjectDetail\\ProjectSettings.tsx (331 lines)
    [TYPES ]  ProjectSettingsProps
    [EXPORTS]  ProjectSettings
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, ../../../../components/ui/Modal, lucide-react
  FILE: \\modules\\Projects\\components\\ProjectDetail\\ProjectTeam.tsx (554 lines)
    [TYPES ]  ProjectTeamProps
    [EXPORTS]  ProjectTeam
    [IMPORTS]  react, ../../../../types, ../../../../components/ui/Button, ../../../../components/ui/Modal, lucide-react, ../PermissionHelpers, ../../../../context/DbContext, ../../../../services/api
  FILE: \\modules\\Projects\\hooks\\useFinances.ts (201 lines)
    [EXPORTS]  useFinances
    [IMPORTS]  react, ../../../services/api, ../../../types

[DIR] ROOT\\modules\\Whiteboard\\components

[DIR] ROOT\\modules\\Whiteboard\\hooks
  FILE: \\modules\\Whiteboard\\types.ts (22 lines)
    [TYPES ]  ResizeHandle, InteractionMode, CanvasTransform, DragState, CanvasData
    [IMPORTS]  ../../types
  FILE: \\modules\\Whiteboard\\Whiteboard.tsx (549 lines)
    [TYPES ]  WhiteboardCanvasProps
    [EXPORTS]  WhiteboardCanvas
    [IMPORTS]  react, ./hooks/useWhiteboardState, ./components/CanvasToolbar, ./components/SelectionGizmo, ./components/NodeContent, ./components/ContextToolbar, ./components/WhiteboardModals, ./components/CanvasContextMenu, ../../types, ../../components/ui/Button, ../../components/ui/Modal, lucide-react, ../Files/context/ExplorerContext, ../Files/utils, ../Files/components/EditorView
  FILE: \\modules\\Whiteboard\\components\\CanvasContextMenu.tsx (245 lines)
    [TYPES ]  CanvasContextMenuProps
    [EXPORTS]  CanvasContextMenu
    [IMPORTS]  react, lucide-react, ../../../types, ./ContextToolbar
  FILE: \\modules\\Whiteboard\\components\\CanvasToolbar.tsx (41 lines)
    [TYPES ]  CanvasToolbarProps
    [EXPORTS]  CanvasToolbar
    [IMPORTS]  react, lucide-react, ../../../components/ui/Button
  FILE: \\modules\\Whiteboard\\components\\ContextToolbar.tsx (231 lines)
    [TYPES ]  ContextToolbarProps
    [EXPORTS]  NOTE_COLORS, FONTS, ContextToolbar
    [IMPORTS]  react, ../../../types, lucide-react
  FILE: \\modules\\Whiteboard\\components\\NodeContent.tsx (329 lines)
    [TYPES ]  NodeContentProps
    [EXPORTS]  NodeContent
    [IMPORTS]  react, ../../../types, ../../Files/hooks/useFileContent, ../../Files/components/ThreeModelViewer, ../../Files/components/MarkdownLinePreview, lucide-react, ../../Files/context/ExplorerContext
  FILE: \\modules\\Whiteboard\\components\\SelectionGizmo.tsx (35 lines)
    [TYPES ]  SelectionGizmoProps
    [EXPORTS]  SelectionGizmo
    [IMPORTS]  react, ../types
  FILE: \\modules\\Whiteboard\\components\\WhiteboardModals.tsx (587 lines)
    [TYPES ]  UploadLocationModalProps, WhiteboardModalsProps
    [EXPORTS]  WhiteboardModals
    [IMPORTS]  react, ../../../components/ui/Modal, ../../../types, ../../Files/context/ExplorerContext, ../../Files/hooks/useFileUpload, ../../Files/hooks/useFileActions, ../../Files/hooks/useFileContent, ../../../components/ui/Button, lucide-react, ../../Files/utils, ../../Files/simplePsd
  FILE: \\modules\\Whiteboard\\hooks\\useWhiteboardState.ts (519 lines)
    [SOCKET]  emit: canvas_update, emit: join_room, on: canvas_update, emit: leave_room
    [TYPES ]  UseWhiteboardStateProps, errors
    [EXPORTS]  useWhiteboardState
    [IMPORTS]  react, ../../../types, ../types, ../../Files/context/ExplorerContext, ../../../services/socket

[DIR] ROOT\\server\\admin

[DIR] ROOT\\server\\auth

[DIR] ROOT\\server\\canvas

[DIR] ROOT\\server\\chat

[DIR] ROOT\\server\\company

[DIR] ROOT\\server\\files

[DIR] ROOT\\server\\finances

[DIR] ROOT\\server\\kanban

[DIR] ROOT\\server\\keys

[DIR] ROOT\\server\\middleware

[DIR] ROOT\\server\\models

[DIR] ROOT\\server\\notifications

[DIR] ROOT\\server\\projects

[DIR] ROOT\\server\\users

[DIR] ROOT\\server\\utils
  FILE: \\server\\db.ts (335 lines)
    [TABLES]  user_settings, user_security, file_public_link_views, file_share_invites, file_share_trust
    [TYPES ]  TEXT
    [EXPORTS]  pool, initDB
    [IMPORTS]  better-sqlite3, mysql2/promise, dotenv, path, fs, crypto, ./models/User.js, ./models/File.js, ./models/Chat.js, ./models/Notification.js, ./models/Kanban.js, ./models/Project.js, ./models/Company.js, ./models/Canvas.js, ./models/Finance.js, ./models/Permission.js
  FILE: \\server\\admin\\index.ts (114 lines)
    [EXPORTS]  requireAdmin, getAllUsers, updateUserRole, updateUserStorageLimit, deleteUser, getAuditLogs
    [IMPORTS]  express, ../db.js, ../middleware/auth.js
  FILE: \\server\\admin\\routes.ts (26 lines)
    [ROUTES]  [GET] /users -> getAllUsers  [PUT] /users/:id/role -> updateUserRole  [PUT] /users/:id/storage -> updateUserStorageLimit  [DELETE] /users/:id -> deleteUser  [GET] /audit-logs -> getAuditLogs
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\auth\\auth.controller.ts (426 lines)
    [EXPORTS]  AuthController
    [IMPORTS]  express, bcrypt, crypto, speakeasy, qrcode, ../db.js, ../utils/jwt.js, ../utils/email.js, ../middleware/auth.js
  FILE: \\server\\auth\\forgot-2fa.ts (73 lines)
    [EXPORTS]  forgot2FA, reset2FA
    [IMPORTS]  express, ../db.js, ../utils/jwt.js, ../utils/email.js
  FILE: \\server\\auth\\forgot-password.ts (39 lines)
    [EXPORTS]  forgotPassword
    [IMPORTS]  express, ../db.js, ../utils/jwt.js, ../utils/email.js
  FILE: \\server\\auth\\forgot-username.ts (32 lines)
    [EXPORTS]  forgotUsername
    [IMPORTS]  express, ../db.js, ../utils/email.js
  FILE: \\server\\auth\\login.ts (74 lines)
    [EXPORTS]  login
    [IMPORTS]  express, bcrypt, ../db.js, ../utils/jwt.js
  FILE: \\server\\auth\\me.ts (38 lines)
    [EXPORTS]  getMe, logout
    [IMPORTS]  express, ../middleware/auth.js
  FILE: \\server\\auth\\register.ts (68 lines)
    [EXPORTS]  register
    [IMPORTS]  express, bcrypt, crypto, ../db.js, ../utils/jwt.js
  FILE: \\server\\auth\\reset-password.ts (40 lines)
    [EXPORTS]  resetPassword
    [IMPORTS]  express, bcrypt, ../db.js, ../utils/jwt.js
  FILE: \\server\\auth\\routes.ts (24 lines)
    [ROUTES]  [POST] /register -> AuthController.register  [POST] /login -> AuthController.login  [POST] /verify-2fa -> AuthController.verify2FA  [POST] /forgot-username -> AuthController.forgotUsername  [POST] /forgot-password -> AuthController.forgotPassword  [POST] /reset-password -> AuthController.resetPassword  [GET] /me -> UserController.getMe  [POST] /logout -> AuthController.logout  [POST] /setup-2fa -> AuthController.setup2FA  [POST] /enable-2fa -> AuthController.enable2FA
    [EXPORTS]  router
    [IMPORTS]  express, ./auth.controller.js, ../users/user.controller.js, ../middleware/auth.js, ../middleware/rateLimit.js
  FILE: \\server\\auth\\setup-2fa.ts (60 lines)
    [EXPORTS]  setup2FA, enable2FA
    [IMPORTS]  express, speakeasy, qrcode, ../db.js, ../middleware/auth.js
  FILE: \\server\\auth\\verify-2fa.ts (68 lines)
    [EXPORTS]  verify2FA
    [IMPORTS]  express, speakeasy, ../db.js, ../utils/jwt.js
  FILE: \\server\\canvas\\index.ts (98 lines)
    [EXPORTS]  getCanvases, getCanvasById, updateCanvas
    [IMPORTS]  express, ../db.js, ../middleware/auth.js
  FILE: \\server\\canvas\\routes.ts (14 lines)
    [ROUTES]  [GET] / -> getCanvases  [GET] /:id -> getCanvasById  [PUT] /:id -> updateCanvas
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\chat\\attachments.ts (180 lines)
    [EXPORTS]  getChatAttachmentMeta, downloadChatAttachment, saveChatAttachmentToFiles
    [IMPORTS]  express, path, fs, crypto, ../db.js, ../middleware/auth.js
  FILE: \\server\\chat\\index.ts (512 lines)
    [EXPORTS]  getChats, getChatMessages, createChat, sendMessage, voteOnPoll, markMessagesRead, editMessage, deleteMessage, updateChat
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto
  FILE: \\server\\chat\\routes.ts (42 lines)
    [ROUTES]  [GET] / -> getChats  [POST] / -> createChat  [PUT] /:id -> updateChat  [GET] /:id/messages -> getChatMessages  [POST] /:id/messages -> sendMessage  [PUT] /:id/messages/read -> markMessagesRead  [POST] /:id/messages/:messageId/poll/vote -> voteOnPoll  [PUT] /:id/messages/:messageId -> editMessage  [DELETE] /:id/messages/:messageId -> deleteMessage  [GET] /:id/attachments/:fileId/meta -> getChatAttachmentMeta  [GET] /:id/attachments/:fileId/download -> downloadChatAttachment  [POST] /:id/attachments/:fileId/save -> saveChatAttachmentToFiles
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js, ./attachments.js
  FILE: \\server\\company\\index.ts (57 lines)
    [EXPORTS]  getCompanies, createCompany
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto
  FILE: \\server\\company\\routes.ts (13 lines)
    [ROUTES]  [GET] / -> getCompanies  [POST] / -> createCompany
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\files\\index.ts (1133 lines)
    [SOCKET]  on: data, on: error, on: end, emit: new_notification
    [TYPES ]  are
    [EXPORTS]  savePublicLinkToFiles, getFiles, getFile, createFile, updateFile, acceptFileShareInvite, declineFileShareInvite, deleteFile, uploadFile, downloadFile, getPublicLinkInfo, viewPublicLinkFile, downloadPublicLinkFile
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto, path, fs, ../utils/permissions.js, ./publicSecurity.js
  FILE: \\server\\files\\publicLinks.ts (213 lines)
    [EXPORTS]  getPublicLinkInfo, viewPublicLinkFile, downloadPublicLinkFile, authPublicLinkPassword
    [IMPORTS]  express, path, fs, ../db.js, ../middleware/auth.js, ./publicSecurity.js
  FILE: \\server\\files\\publicSecurity.ts (75 lines)
    [EXPORTS]  hashPassword, verifyPassword, signPublicLinkToken, verifyPublicLinkToken, normalizeViewerKey, anonymizeViewerKey
    [IMPORTS]  crypto
  FILE: \\server\\files\\routes.ts (178 lines)
    [ROUTES]  [GET] /public/:linkId -> getPublicLinkInfo  [GET] /public/:linkId/view -> viewPublicLinkFile  [GET] /public/:linkId/download -> downloadPublicLinkFile  [POST] /public/:linkId/auth -> authPublicLinkPassword  [POST] /public/:linkId/save -> savePublicLinkToFiles  [POST] /share-invites/:inviteId/accept -> acceptFileShareInvite  [POST] /share-invites/:inviteId/decline -> declineFileShareInvite  [POST] /blob  [GET] /blob/:hash  [GET] /blob/:hash/refs  [POST] /blob/:hash/refs  [DELETE] /blob/:hash/refs  [GET] / -> getFiles  [GET] /:id -> getFile  [POST] / -> createFile  [PUT] /:id -> updateFile  [DELETE] /:id -> deleteFile  [POST] /upload  [GET] /:id/download -> downloadFile
    [SOCKET]  on: data, on: error, on: end
    [EXPORTS]  router
    [IMPORTS]  express, multer, path, fs, crypto, ../db.js, ../middleware/auth.js, ./index.js, ./publicLinks.js
  FILE: \\server\\finances\\index.ts (129 lines)
    [EXPORTS]  getFinances, createFinance, deleteFinance, updateFinance
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto
  FILE: \\server\\finances\\routes.ts (15 lines)
    [ROUTES]  [GET] / -> getFinances  [POST] / -> createFinance  [PUT] /:id -> updateFinance  [DELETE] /:id -> deleteFinance
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\kanban\\index.ts (259 lines)
    [EXPORTS]  getBoards, getBoardById, updateBoard
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto
  FILE: \\server\\kanban\\routes.ts (14 lines)
    [ROUTES]  [GET] / -> getBoards  [GET] /:id -> getBoardById  [PUT] /:id -> updateBoard
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\keys\\private.pem (29 lines)
  FILE: \\server\\keys\\public.pem (10 lines)
  FILE: \\server\\middleware\\auth.ts (53 lines)
    [TYPES ]  AuthRequest
    [EXPORTS]  requireAuth
    [IMPORTS]  express, ../utils/jwt.js, ../db.js
  FILE: \\server\\middleware\\rateLimit.ts (26 lines)
    [EXPORTS]  loginLimiter, registerLimiter, generalAuthLimiter
    [IMPORTS]  express-rate-limit
  FILE: \\server\\models\\Canvas.ts (33 lines)
    [TABLES]  canvases, canvas_shared_users, canvas_shared_projects
    [EXPORTS]  initCanvasModel
  FILE: \\server\\models\\Chat.ts (86 lines)
    [TABLES]  chats, chat_members, messages, message_edits, message_attachments, message_reads, message_mentions, message_polls, message_poll_options, message_poll_votes
    [TYPES ]  VARCHAR
    [EXPORTS]  initChatModel
  FILE: \\server\\models\\Company.ts (13 lines)
    [TABLES]  companies
    [EXPORTS]  initCompanyModel
  FILE: \\server\\models\\File.ts (76 lines)
    [TABLES]  files, file_tags, file_versions, file_shares, file_public_links
    [TYPES ]  VARCHAR
    [EXPORTS]  initFileModel
  FILE: \\server\\models\\Finance.ts (25 lines)
    [TABLES]  finances
    [TYPES ]  VARCHAR
    [EXPORTS]  initFinanceModel
  FILE: \\server\\models\\Kanban.ts (89 lines)
    [TABLES]  kanban_boards, kanban_columns, kanban_tasks, kanban_task_subtasks, kanban_task_comments, kanban_task_attachments, kanban_task_tags, kanban_automation_rules, kanban_automation_actions
    [EXPORTS]  initKanbanModel
  FILE: \\server\\models\\Notification.ts (18 lines)
    [TABLES]  notifications
    [TYPES ]  VARCHAR
    [EXPORTS]  initNotificationModel
  FILE: \\server\\models\\Permission.ts (96 lines)
    [TABLES]  roles, teams, team_members, project_user_permissions, project_team_permissions, company_user_permissions, permission_audit_logs
    [EXPORTS]  initPermissionModel
  FILE: \\server\\models\\Project.ts (31 lines)
    [TABLES]  projects, project_timeline_events
    [TYPES ]  VARCHAR
    [EXPORTS]  initProjectModel
  FILE: \\server\\models\\User.ts (56 lines)
    [TABLES]  users
    [TYPES ]  User
    [EXPORTS]  initUserModel
  FILE: \\server\\notifications\\index.ts (173 lines)
    [SOCKET]  emit: new_notification
    [TYPES ]  const
    [EXPORTS]  getNotifications, markAsRead, markAllAsRead, clearAll, createNotification
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto, socket.io
  FILE: \\server\\notifications\\routes.ts (16 lines)
    [ROUTES]  [GET] / -> getNotifications  [PUT] /read-all -> markAllAsRead  [DELETE] /clear-all -> clearAll  [PUT] /:id/read -> markAsRead  [POST] / -> createNotification
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\projects\\index.ts (276 lines)
    [EXPORTS]  getProjects, getProjectById, createProject, updateProject, deleteProject, getProjectMembers, addProjectMember, removeProjectMember
    [IMPORTS]  express, ../db.js, ../middleware/auth.js, crypto, ../utils/permissions.js
  FILE: \\server\\projects\\routes.ts (29 lines)
    [ROUTES]  [GET] / -> getProjects  [POST] / -> createProject  [GET] /:id -> getProjectById  [PUT] /:id -> updateProject  [DELETE] /:id -> deleteProject  [GET] /:id/members -> getProjectMembers  [POST] /:id/members -> addProjectMember  [DELETE] /:id/members/:userId -> removeProjectMember
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./index.js
  FILE: \\server\\users\\index.ts (97 lines)
    [EXPORTS]  getMe, updateMe, getUsers, getUserById
    [IMPORTS]  express, ../db.js, ../middleware/auth.js
  FILE: \\server\\users\\routes.ts (19 lines)
    [ROUTES]  [GET] /me -> UserController.getMe  [PUT] /me -> UserController.updateProfile  [GET] / -> UserController.getUsers  [GET] /:id -> UserController.getUserById
    [EXPORTS]  router
    [IMPORTS]  express, ../middleware/auth.js, ./user.controller.js
  FILE: \\server\\users\\user.controller.ts (142 lines)
    [EXPORTS]  UserController
    [IMPORTS]  express, ../db.js, ../middleware/auth.js

[DIR] ROOT\\server\\utils\\gif
  FILE: \\server\\utils\\email.ts (11 lines)
    [EXPORTS]  sendEmail
  FILE: \\server\\utils\\jwt.ts (47 lines)
    [EXPORTS]  signToken, verifyToken
    [IMPORTS]  jsonwebtoken, crypto, fs, path
  FILE: \\server\\utils\\permissions.ts (63 lines)
    [EXPORTS]  checkProjectPermission
    [IMPORTS]  ../db.js
  FILE: \\server\\utils\\gif\\routes.ts (180 lines)
    [ROUTES]  [GET] /trending  [GET] /search
    [TYPES ]  GifItem, CacheEntry
    [EXPORTS]  router
    [IMPORTS]  express
  FILE: \\services\\api.ts (114 lines)
    [EXPORTS]  api
    [IMPORTS]  ../types
  FILE: \\services\\blobStorage.ts (122 lines)
    [EXPORTS]  blobStorage
  FILE: \\services\\mockDb.ts (451 lines)
    [EXPORTS]  db
    [IMPORTS]  ../types, ./blobStorage
  FILE: \\services\\socket.ts (18 lines)
    [EXPORTS]  socket, connectSocket, disconnectSocket
    [IMPORTS]  socket.io-client
  FILE: \\utils\\formatters.ts (8 lines)
    [EXPORTS]  formatBytes

============================================================
    [MODELS]  canvas_shared_projects, canvas_shared_users, canvases, chat_members, chats, companies, company_user_permissions, file_public_link_views, file_public_links, file_share_invites, file_share_trust, file_shares, file_tags, file_versions, files, finances, kanban_automation_actions, kanban_automation_rules, kanban_boards, kanban_columns, kanban_task_attachments, kanban_task_comments, kanban_task_subtasks, kanban_task_tags, kanban_tasks, message_attachments, message_edits, message_mentions, message_poll_options, message_poll_votes, message_polls, message_reads, messages, notifications, permission_audit_logs, project_team_permissions, project_timeline_events, project_user_permissions, projects, roles, team_members, teams, user_security, user_settings, users
    [STATE ]  DbContext, ExplorerContext, KanbanContext
Done. Scanned 178 files. (Total Lines: 40668)
============================================================
`;
