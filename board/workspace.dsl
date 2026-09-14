workspace "Open metaverse territory" "The Metaverse Standards Forum infrastructure map as a C4 model: 162 capabilities in 14 groups, 57 subjects, and 6,882 claims. This model covers the original 12 groups; World sensing and Generation & capture are in the database but not yet modelled here." {

    model {

        stack = softwareSystem "Open metaverse stack" "The 162 capabilities an open metaverse needs, in 14 groups. This model covers 12 of the 14; World sensing and Generation & capture are not yet modelled here." "stack" {

            render = container "Rendering & presentation" "10 capabilities, on the engine plane." "engine" "capability_group,engine" {
                render_raster = component "Rasterization pipeline" "Turning scene geometry into pixels, including the render graph and pass structure." "format" "capability,format"
                render_gpu_api = component "Graphics interface binding" "Which low-level graphics interface the renderer targets." "format" "capability,format"
                render_material = component "Material model" "How surface appearance is described and evaluated at render time." "format" "capability,format"
                render_lighting = component "Lighting and global illumination" "Direct and indirect light, shadows, probes, baked or real time." "format" "capability,format"
                render_post = component "Post-processing" "Effects applied after the main render pass." "format" "capability,format"
                render_lod = component "Level of detail and streaming order" "Choosing what detail to show and what to send first. An interoperability question once geometry is streamed." "protocol" "capability,protocol"
                render_splat = component "Gaussian splatting and radiance fields" "Rendering captured scenes represented as splats or radiance fields rather than meshes." "format" "capability,format"
                render_volumetric = component "Volumetric and point cloud" "Rendering point clouds, voxels and volumetric video." "format" "capability,format"
                render_text = component "Text rendering" "Legible text in three dimensions, including fonts and layout." "format" "capability,format"
                render_camera = component "Camera and viewpoint model" "How viewpoints are defined, bound and moved between." "format" "capability,format"
            }

            scene = container "Scene & assets" "14 capabilities, on the engine plane." "engine" "capability_group,engine" {
                scene_graph = component "Scene graph model" "The tree or graph of objects and their relationships." "format" "capability,format"
                scene_transform = component "Transforms and coordinate convention" "Handedness, axis order, and how transforms compose." "format" "capability,format"
                scene_container = component "Asset container format" "The file that carries a model or scene between tools and runtimes." "format" "capability,format"
                scene_geometry = component "Geometry encoding" "How meshes are encoded and compressed." "format" "capability,format"
                scene_texture = component "Texture encoding" "Image formats and compression for the target device." "format" "capability,format"
                scene_material_x = component "Material exchange" "Carrying material definitions between different renderers without loss." "format" "capability,format"
                scene_animation = component "Animation encoding" "How keyframes and animation clips are stored and replayed." "format" "capability,format"
                scene_skeleton = component "Skeleton and rig definition" "Bone hierarchy and binding, so a body moves correctly elsewhere." "format" "capability,format"
                scene_morph = component "Morph targets and blend shapes" "Shape deformation used for faces and detail." "format" "capability,format"
                scene_instancing = component "Instancing" "Repeating an object many times cheaply." "format" "capability,format"
                scene_compose = component "Scene composition and overrides" "Layering, referencing and overriding parts of a scene from several sources." "format" "capability,format"
                scene_units = component "Units and scale" "Real-world scale agreement so imported content is the right size." "format" "capability,format"
                scene_licence = component "Rights and licence metadata" "What a recipient is permitted to do with an asset, carried with the asset." "format" "capability,format"
                scene_provenance = component "Provenance and authorship" "Signed record of who made an asset and how." "format" "capability,format"
            }

            avatar = container "Avatars" "7 capabilities, on the engine plane." "engine" "capability_group,engine" {
                avatar_body = component "Avatar body format" "The portable description of an avatar's mesh and appearance." "format" "capability,format"
                avatar_skeleton = component "Avatar skeleton standard" "An agreed bone naming and structure so animation transfers." "format" "capability,format"
                avatar_expression = component "Facial expression standard" "Named expressions and visemes that survive a move between worlds." "format" "capability,format"
                avatar_retarget = component "Animation retargeting" "Playing animation authored for one body on another." "protocol" "capability,protocol"
                avatar_wearable = component "Attachments and wearables" "Items worn or carried, with attachment points that survive transfer." "format" "capability,format"
                avatar_lod = component "Avatar level of detail" "Reduced avatar representations for crowds and weak devices." "protocol" "capability,protocol"
                avatar_identity = component "Avatar to identity binding" "Tying an avatar to a verifiable identity or credential." "protocol" "capability,protocol"
            }

            physics = container "Physics & simulation" "7 capabilities, on the engine plane." "engine" "capability_group,engine" {
                physics_rigid = component "Rigid bodies" "Mass, velocity and the bodies that move by rule." "format" "capability,format"
                physics_collision = component "Collision shapes" "The shapes used for contact tests, separate from visible geometry." "format" "capability,format"
                physics_joint = component "Joints and constraints" "Hinges, sliders and other links between bodies." "format" "capability,format"
                physics_material = component "Physics materials" "Friction, restitution and surface response." "format" "capability,format"
                physics_determinism = component "Deterministic simulation" "Same inputs producing the same outcome on different machines." "protocol" "capability,protocol"
                physics_soft = component "Soft bodies and cloth" "Deformable simulation." "format" "capability,format"
                physics_trigger = component "Trigger volumes" "Regions that fire events when entered." "format" "capability,format"
            }

            audio = container "Audio" "6 capabilities, on the engine plane." "engine" "capability_group,engine" {
                audio_source = component "Positioned audio sources" "Sound placed in the scene with distance and direction." "format" "capability,format"
                audio_spatial = component "Spatialization model" "How direction is rendered to the ears, by head-related transfer or ambisonics." "format" "capability,format"
                audio_room = component "Room acoustics and reverb" "How a space colours sound." "format" "capability,format"
                audio_occlusion = component "Occlusion and obstruction" "Sound blocked or muffled by geometry." "format" "capability,format"
                audio_stream = component "Audio streaming" "Delivering audio over the network at scale." "protocol" "capability,protocol"
                audio_voice = component "Voice transport" "Carrying live voice between participants." "protocol" "capability,protocol"
            }

            net = container "Networking & session" "12 capabilities, on the interop plane." "interop" "capability_group,interop" {
                net_replication = component "State replication" "Which state is shared, how often, and in what form." "protocol" "capability,protocol"
                net_authority = component "Authority and ownership" "Who decides the truth for a given object." "protocol" "capability,protocol"
                net_interest = component "Interest management" "Sending each client only what it needs." "protocol" "capability,protocol"
                net_prediction = component "Prediction and reconciliation" "Hiding latency locally and correcting afterwards." "protocol" "capability,protocol"
                net_transport = component "Transport protocol" "The wire protocol carrying session traffic." "protocol" "capability,protocol"
                net_media = component "Media transport" "Carrying live audio and video streams." "protocol" "capability,protocol"
                net_session = component "Session establishment" "Joining a running world, including authentication." "protocol" "capability,protocol"
                net_handoff = component "Session handoff and portals" "Leaving one world and arriving in another with state intact." "protocol" "capability,protocol"
                net_presence = component "Presence and roster" "Knowing who is where, across operators." "protocol" "capability,protocol"
                net_address = component "World addressing and naming" "Naming a place and resolving that name to a reachable destination." "protocol" "capability,protocol"
                net_discovery = component "Discovery" "Finding worlds, nodes or services without knowing them in advance." "protocol" "capability,protocol"
                net_time = component "Clock and time model" "Shared time so events order consistently." "protocol" "capability,protocol"
            }

            identity = container "Identity, trust & rights" "7 capabilities, on the interop plane." "interop" "capability_group,interop" {
                identity_root = component "Identity root" "The base identifier for a person, agent or thing." "protocol" "capability,protocol"
                identity_credential = component "Credential format" "How verifiable claims about a subject are expressed." "protocol" "capability,protocol"
                identity_exchange = component "Credential exchange protocol" "How two parties request and present credentials." "protocol" "capability,protocol"
                identity_capability = component "Capability and permission grant" "What a subject may do, readable by a party that did not issue it." "protocol" "capability,protocol"
                identity_privacy = component "Selective disclosure" "Revealing only what a receiving world needs." "protocol" "capability,protocol"
                identity_social = component "Reputation and social graph" "Portable relationships and standing." "protocol" "capability,protocol"
                identity_rights = component "Rights enforcement" "Acting on licence terms at the point of use." "protocol" "capability,protocol"
            }

            geo = container "Spatial & geospatial" "7 capabilities, on the interop plane." "interop" "capability_group,interop" {
                geo_pose = component "Geospatial pose" "Position and orientation expressed against the Earth." "format" "capability,format"
                geo_crs = component "Coordinate reference systems" "Agreeing which frame coordinates are expressed in." "format" "capability,format"
                geo_anchor_local = component "Local anchors" "Fixing content to a place on one device." "protocol" "capability,protocol"
                geo_anchor_shared = component "Shared and persistent anchors" "Fixing content to a place across devices and sessions." "protocol" "capability,protocol"
                geo_vps = component "Visual positioning" "Recovering precise pose from camera imagery." "protocol" "capability,protocol"
                geo_tiles = component "Tiled terrain and city streaming" "Streaming large geospatial 3D data by tile." "protocol" "capability,protocol"
                geo_indoor = component "Indoor mapping" "Structured description of interior spaces." "format" "capability,format"
            }

            input = container "Input & devices" "6 capabilities, on the engine plane." "engine" "capability_group,engine" {
                input_session = component "Immersive session lifecycle" "Starting, running and ending an immersive session on a device." "protocol" "capability,protocol"
                input_controller = component "Controller input" "Buttons, sticks and pose from handheld devices." "protocol" "capability,protocol"
                input_hand = component "Hand tracking" "Articulated hand pose as an input source." "protocol" "capability,protocol"
                input_eye = component "Eye tracking" "Gaze direction as input, with its privacy constraints." "protocol" "capability,protocol"
                input_haptic = component "Haptics" "Touch feedback to the user." "protocol" "capability,protocol"
                input_devcaps = component "Device capability discovery" "Learning what the client device can actually do." "protocol" "capability,protocol"
            }

            logic = container "Logic & behaviour" "5 capabilities, on the engine plane." "engine" "capability_group,engine" {
                logic_script = component "Scripting runtime" "The language and runtime that expresses world rules." "format" "capability,format"
                logic_behaviour = component "Behaviour graphs and interactivity" "Declarative interactivity that travels with an asset." "format" "capability,format"
                logic_sandbox = component "Sandboxing and isolation" "Running untrusted content safely, with limits." "format" "capability,format"
                logic_agent = component "Agent integration" "Autonomous agents acting inside a world." "protocol" "capability,protocol"
                logic_budget = component "Resource budgets" "Bounding memory, time and calls for guest content." "format" "capability,format"
            }

            persist = container "Persistence & storage" "4 capabilities, on the interop plane." "interop" "capability_group,interop" {
                persist_world = component "World state persistence" "What survives a restart of the world." "protocol" "capability,protocol"
                persist_inventory = component "Inventory" "Items a user holds, and whether they travel." "protocol" "capability,protocol"
                persist_prefs = component "Preference portability" "Settings and accessibility choices that follow the user." "protocol" "capability,protocol"
                persist_content_addr = component "Content addressing" "Referring to content by hash rather than location." "format" "capability,format"
            }

            deliver = container "Packaging & delivery" "4 capabilities, on the entry plane." "entry" "capability_group,entry" {
                deliver_bundle = component "Bundle format" "How a runnable experience is packaged." "format" "capability,format"
                deliver_cdn = component "Content delivery" "Getting assets to clients at scale." "protocol" "capability,protocol"
                deliver_version = component "Versioning and update" "Shipping changes without breaking existing content." "format" "capability,format"
                deliver_conformance = component "Conformance testing" "Proving an implementation actually matches the specification." "format" "capability,format"
            }
        }

        # Every subject on the map is a software system of its own. Tags carry its kind
        # and its status; the group property carries the chip group the page draws it in.

        godot = softwareSystem "Godot" "Godot is a free and open source game engine published under the MIT licence; the current stable release is 4.7.2, announced on 18 August 2026, in the 4.7 feature line released on 18 June 2026." "game-engine,shipping" {
            url "https://godotengine.org/"
            properties {
                "group" "Game engines"
                "org" "Godot Foundation"
                "licence" "MIT"
                "version" "4.7.2"
            }
        }

        unity = softwareSystem "Unity" "Unity is a commercial real-time three-dimensional engine and editor." "game-engine,shipping" {
            url "https://unity.com/"
            properties {
                "group" "Game engines"
                "org" "Unity Technologies"
                "licence" "proprietary"
            }
        }

        unreal = softwareSystem "Unreal Engine" "Unreal Engine is Epic Games' source-available real-time engine." "game-engine,shipping" {
            url "https://www.unrealengine.com/"
            properties {
                "group" "Game engines"
                "org" "Epic Games"
                "licence" "source-available"
                "version" "5.8"
            }
        }

        horizon = softwareSystem "Horizon Worlds" "Meta Horizon Worlds is a closed social platform that Meta both builds and runs: worlds are authored in Meta's own desktop editor or inside the headset, and a published world is never a file a creator can hold, because it lives in Meta's store and reaches players only through Meta's own app." "platform,shipping" {
            url "https://horizon.meta.com/"
            properties {
                "group" "Platforms"
                "org" "Meta"
                "licence" "proprietary"
            }
        }

        recroom = softwareSystem "Rec Room" "Rec Room was a social virtual world platform with an in-headset building tool and a Unity-based external editor called Rec Room Studio." "platform,shutdown" {
            url "https://recroom.com/"
            properties {
                "group" "Platforms"
                "org" "Rec Room Inc"
                "licence" "proprietary"
            }
        }

        resonite = softwareSystem "Resonite" "Resonite is a social virtual world platform built on a live, fully reflective data model, where a wristwatch and a whole world are the same kind of object and both can be taken apart by hand while other people are standing in them." "platform,shipping" {
            url "https://resonite.com/"
            properties {
                "group" "Platforms"
                "org" "Yellow Dog Man Studios"
                "licence" "proprietary"
            }
        }

        roblox = softwareSystem "Roblox" "Roblox is a proprietary platform and also, by a wide margin, the best documented subject in this map: its creator documentation is open source, its engine reference and cloud interface descriptions ship with it, and its scripting language Luau is published separately under a permissive licence with its own site and a standalone runtime, making Luau the one Roblox artefact anyone else can simply pick up and use." "platform,shipping" {
            url "https://www.roblox.com/"
            properties {
                "group" "Platforms"
                "org" "Roblox Corporation"
                "licence" "proprietary"
            }
        }

        vrchat = softwareSystem "VRChat" "VRChat is a social virtual world platform built on the Unity game engine, where both worlds and avatars are authored in Unity and uploaded." "platform,shipping" {
            url "https://hello.vrchat.com/"
            properties {
                "group" "Platforms"
                "org" "VRChat Inc"
                "licence" "proprietary"
            }
        }

        omb = softwareSystem "Open Metaverse Browser" "The Open Metaverse Browser is the Metaverse Standards Forum's own attempt at a neutral client for spatial content, and it is the only subject on this map that is a working browser with a downloadable binary and a documented module interface." "project,preview" {
            url "https://metaverse-standards.org/open-metaverse-browser-initiative/"
            properties {
                "group" "MSF standards & projects"
                "org" "Metaverse Standards Forum"
                "version" "0.3.0"
            }
        }

        rp1 = softwareSystem "RP1 Spatial Fabric" "RP1 Spatial Fabric is the idea that a place in three dimensions can be a document with a URL, the way a web page is, plus the stack that makes that real: a signed fabric file, a native engine that reads it, and a browser that opens it." "project,mixed" {
            url "https://github.com/MetaversalCorp/Rubidium"
            properties {
                "group" "MSF standards & projects"
                "org" "RP1"
                "version" "0.3.0"
            }
        }

        teleportxr = softwareSystem "TeleportXR" "TeleportXR is a session protocol, not a document format." "project,draft" {
            url "https://docs.teleportxr.io/"
            properties {
                "group" "MSF standards & projects"
                "org" "Teleport XR Ltd"
                "licence" "MIT"
                "version" "0.9"
            }
        }

        wow = softwareSystem "Web of Worlds" "Web of Worlds is a Metaverse Standards Forum direction for making virtual worlds addressable and linkable with ordinary web machinery, announced by the Forum's 3D Web Interoperability Working Group on 2 June 2026." "project,whitepaper" {
            url "https://webofworlds.github.io/initial_MSF_Whitepaper/"
            properties {
                "group" "MSF standards & projects"
                "org" "Metaverse Standards Forum"
                "licence" "Apache-2.0"
                "version" "0.0.1"
            }
        }

        c2pa = softwareSystem "C2PA Content Credentials" "Content Credentials record who made a piece of content and what was done to it, as signed statements bound to the bytes of the file." "standard,shipping" {
            url "https://c2pa.org/"
            properties {
                "group" "Standards"
                "org" "C2PA"
                "licence" "open"
            }
        }

        did = softwareSystem "Decentralized Identifiers" "A decentralized identifier gives a person, an agent or a thing a name that its own controller holds, rather than one an account provider issues." "standard,ratified" {
            url "https://www.w3.org/TR/did-core/"
            properties {
                "group" "Standards"
                "org" "W3C"
                "licence" "W3C"
                "version" "1.0"
            }
        }

        ieee2874 = softwareSystem "IEEE 2874 Spatial Web" "This is a reference model, not something an engineer can build against yet: its own project record says it provides a reference model and defines requirements for a set of implementation specifications still to be developed, and the foundation that wrote the base document lists those implementation standards as under development." "standard,board-approved" {
            url "https://standards.ieee.org/ieee/2874/11717/"
            properties {
                "group" "Standards"
                "org" "IEEE"
                "licence" "paid"
                "version" "2874-2025"
            }
        }

        iwps = softwareSystem "Inter-World Portaling System" "The Inter-World Portaling System is OMA3's draft protocol for one narrow job, moving a person from one virtual world to another, and it does that job with two calls over ordinary web protocols." "standard,draft" {
            url "https://github.com/oma3dao/iwps-specification"
            properties {
                "group" "MSF standards & projects"
                "org" "OMA3"
                "version" "0.3"
            }
        }

        mpeg_arf = softwareSystem "MPEG-I Avatar Representation Format" "A draft international standard for carrying a person's avatar between applications." "standard,draft" {
            url "https://www.iso.org/standard/91745.html"
            properties {
                "group" "Standards"
                "org" "ISO-IEC SC29"
                "licence" "paid"
                "version" "23090-39 DIS"
            }
        }

        mpeg_audio = softwareSystem "MPEG-I Immersive Audio" "A finished international standard for immersive sound in virtual and augmented spaces, published on 2025-11-03 as edition 1.0." "standard,ratified" {
            url "https://www.iso.org/standard/110278"
            properties {
                "group" "Standards"
                "org" "ISO-IEC SC29"
                "licence" "paid"
                "version" "23090-4:2025"
            }
        }

        mpeg_scene = softwareSystem "MPEG-I Scene Description" "A published international standard, now in its second edition as ISO/IEC 23090-14:2025, that defines no scene format of its own." "standard,ratified" {
            url "https://www.iso.org/standard/90191.html"
            properties {
                "group" "Standards"
                "org" "ISO-IEC SC29"
                "licence" "paid"
                "version" "23090-14:2025"
            }
        }

        3dtiles = softwareSystem "OGC 3D Tiles (Community Standard)" "Streaming very large three-dimensional geospatial data by tile, and the only thing on this map that solves that problem in a ratified document." "standard,ratified" {
            url "https://docs.ogc.org/cs/22-025r4/22-025r4.html"
            properties {
                "group" "Standards"
                "org" "OGC"
                "licence" "royalty-free"
                "version" "1.1"
            }
        }

        geopose = softwareSystem "OGC GeoPose" "OGC GeoPose is a small, finished standard that does one job: say where something is on Earth and which way it is facing, in a form two systems can exchange." "standard,ratified" {
            url "https://docs.ogc.org/is/21-056r11/21-056r11.html"
            properties {
                "group" "Standards"
                "org" "OGC"
                "licence" "royalty-free"
                "version" "1.0"
            }
        }

        usd = softwareSystem "OpenUSD Core Specification" "The machinery for combining a scene out of many files is standardized." "standard,ratified" {
            url "https://aousd.org/usd-core-specification/"
            properties {
                "group" "Standards"
                "org" "Alliance for OpenUSD"
                "licence" "CC-BY-ND"
                "version" "1.0.1"
            }
        }

        openxr = softwareSystem "OpenXR" "The settled way for an application to talk to a headset or a pair of glasses: it covers the session, the frame loop, the tracked spaces, the views to draw, the input actions and touch feedback." "standard,ratified" {
            url "https://registry.khronos.org/OpenXR/"
            properties {
                "group" "Standards"
                "org" "Khronos"
                "licence" "royalty-free"
                "version" "1.1.62"
            }
        }

        um = softwareSystem "Universal Manifest" "Universal Manifest is a portable signed identity envelope: a JSON-LD document carrying who a person, agent or device is, what they consent to, and pointers to the heavier things they own, signed with a profile called Signature Profile A." "standard,draft" {
            url "https://universalmanifest.net/spec/latest/"
            properties {
                "group" "MSF standards & projects"
                "org" "Universal Manifest Working Group"
                "licence" "W3C"
                "version" "0.4"
            }
        }

        vrm = softwareSystem "VRM" "VRM is a humanoid avatar format built on glTF 2.0: a VRM file is a binary glTF file with one added extension and a changed file suffix, so everything the base format settles about meshes, textures and skins is inherited unchanged." "standard,ratified" {
            url "https://vrm.dev/"
            properties {
                "group" "Standards"
                "org" "VRM Consortium"
                "licence" "MIT"
                "version" "1.0"
            }
        }

        vc = softwareSystem "Verifiable Credentials Data Model" "A verifiable credential is a signed statement made by one party about a subject that a third party can check without asking the first party." "standard,ratified" {
            url "https://www.w3.org/TR/vc-data-model-2.0/"
            properties {
                "group" "Standards"
                "org" "W3C"
                "licence" "W3C"
                "version" "2.0"
            }
        }

        webgpu = softwareSystem "WebGPU" "A low level interface that lets a web page drive the graphics processor for drawing and for general computation, designed to map onto the native driver interfaces used on Windows, Apple platforms and Vulkan." "standard,candidate" {
            url "https://www.w3.org/TR/webgpu/"
            properties {
                "group" "Standards"
                "org" "W3C"
                "licence" "W3C"
                "version" "CR Draft"
            }
        }

        webxr = softwareSystem "WebXR Device API" "The way a web page reaches a headset or a phone's pass-through camera: it covers starting and ending an immersive session, the tracked spaces, the viewer's pose, the views to draw, the input sources and the frame loop." "standard,candidate" {
            url "https://www.w3.org/TR/webxr/"
            properties {
                "group" "Standards"
                "org" "W3C"
                "licence" "W3C"
                "version" "CR Draft"
            }
        }

        x3d = softwareSystem "X3D (ISO/IEC 19775-1)" "The oldest thing on this map and by far the widest." "standard,ratified" {
            url "https://www.web3d.org/x3d4"
            properties {
                "group" "Standards"
                "org" "Web3D / ISO-IEC"
                "licence" "published"
                "version" "4.0"
            }
        }

        gltf = softwareSystem "glTF" "The settled way to hand a three-dimensional model from one tool to another." "standard,ratified" {
            url "https://registry.khronos.org/glTF/"
            properties {
                "group" "Standards"
                "org" "Khronos"
                "licence" "royalty-free"
                "version" "2.0.1"
            }
        }

        gltf21 = softwareSystem "glTF 2.1" "A planned backward-compatible revision of the glTF core, announced on 2026-06-11 and still being written." "standard,in-development" {
            url "https://www.khronos.org/blog/introducing-gltf-2.1-with-complex-scenes"
            properties {
                "group" "Standards"
                "org" "Khronos"
                "licence" "royalty-free"
                "version" "2.1"
            }
        }

        babylonjs = softwareSystem "Babylon.js" "Babylon.js is an open-source web rendering engine and application framework from Microsoft and community contributors, shipping as one core package plus official sibling packages for asset loading, asset saving, user interface, add-ons and editors; the newest release when this was written is 9.22.1, published 2026-08-20." "web-runtime,shipping" {
            url "https://www.babylonjs.com/"
            properties {
                "group" "Web runtimes"
                "org" "Microsoft and contributors"
                "licence" "Apache-2.0"
            }
        }

        cesiumjs = softwareSystem "CesiumJS" "CesiumJS is an open source JavaScript library for drawing a whole-Earth globe and streaming very large geographic three-dimensional data into a web browser." "web-runtime,shipping" {
            url "https://cesium.com/platform/cesiumjs/"
            properties {
                "group" "Web runtimes"
                "org" "Cesium GS"
                "licence" "Apache-2.0"
            }
        }

        playcanvas = softwareSystem "PlayCanvas" "PlayCanvas is two things under one name: an open-source runtime released under the MIT licence, and a hosted editor and publishing service at playcanvas.com." "web-runtime,shipping" {
            url "https://playcanvas.com/"
            properties {
                "group" "Web runtimes"
                "org" "PlayCanvas"
                "licence" "MIT"
            }
        }

        threejs = softwareSystem "Three.js" "Three.js is an open source JavaScript library for drawing three-dimensional scenes in a web browser." "web-runtime,shipping" {
            url "https://threejs.org/"
            properties {
                "group" "Web runtimes"
                "org" "mrdoob and contributors"
                "licence" "MIT"
            }
        }

        # One relationship per claim that reaches a capability. A claim recorded as
        # absent or out of scope draws nothing.

        3dtiles -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> geo_crs "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> geo_pose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> geo_tiles "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> logic_script "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> render_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> render_volumetric "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> scene_instancing "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        3dtiles -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> avatar_body "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> avatar_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> avatar_retarget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> geo_anchor_local "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> geo_crs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> geo_indoor "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> geo_pose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> geo_tiles "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> input_devcaps "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> input_eye "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> input_hand "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> input_haptic "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> logic_behaviour "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> logic_budget "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> logic_script "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_collision "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_determinism "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_joint "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_material "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_rigid "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_soft "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> physics_trigger "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_splat "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_licence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        babylonjs -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> identity_credential "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> identity_privacy "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> persist_content_addr "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> scene_licence "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        c2pa -> scene_provenance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> geo_crs "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> geo_pose "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> geo_tiles "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> input_session "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> logic_budget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_splat "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_text "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_graph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        cesiumjs -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        did -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        did -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        did -> identity_root "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        did -> net_discovery "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        did -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> geo_crs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> geo_pose "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        geopose -> scene_units "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> audio_spatial "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> logic_behaviour "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> render_lighting "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> render_lod "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> render_splat "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_instancing "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_licence "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_material_x "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_provenance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> logic_behaviour "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> physics_collision "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> render_splat "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_licence "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_morph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        gltf21 -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> audio_room "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        godot -> avatar_body "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        godot -> avatar_expression "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> avatar_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> avatar_retarget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> deliver_bundle "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> geo_anchor_local "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> geo_indoor "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> input_eye "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> input_hand "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> input_haptic "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> net_interest "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> net_transport "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> physics_joint "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> physics_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> physics_soft "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        godot -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> audio_voice "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> avatar_body "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> avatar_identity "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> deliver_bundle "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> identity_rights "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> identity_social "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> input_controller "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> input_devcaps "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> input_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> logic_agent "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> logic_behaviour "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> logic_budget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> logic_script "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_address "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_discovery "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_handoff "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_media "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        horizon -> net_replication "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        horizon -> persist_inventory "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> persist_prefs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> physics_material "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> render_lighting "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> render_material "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> render_text "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_animation "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_container "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_instancing "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_licence "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_material_x "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        horizon -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        horizon -> scene_units "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        ieee2874 -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        ieee2874 -> identity_credential "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        ieee2874 -> identity_rights "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        ieee2874 -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        ieee2874 -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        ieee2874 -> net_discovery "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        iwps -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> identity_exchange "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> net_handoff "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        iwps -> net_transport "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_arf -> avatar_body "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> avatar_expression "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> avatar_identity "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> avatar_lod "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> avatar_retarget "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> net_replication "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_arf -> scene_transform "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> audio_occlusion "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> audio_room "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> audio_spatial "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> audio_stream "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> geo_anchor_local "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> net_media "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> persist_prefs "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> physics_trigger "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_audio -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> audio_room "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> audio_spatial "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> audio_stream "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> avatar_body "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> geo_anchor_local "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> input_haptic "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> logic_behaviour "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> net_media "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> net_replication "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> net_transport "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        mpeg_scene -> scene_animation "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        mpeg_scene -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> deliver_bundle "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> deliver_version "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        omb -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> logic_behaviour "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_address "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_authority "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_interest "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_replication "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> net_transport "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_gpu_api "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_material "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> render_text "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_compose "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_instancing "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_provenance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        omb -> scene_units "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> audio_source "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> audio_spatial "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> avatar_expression "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> geo_anchor_local "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> geo_crs "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> geo_indoor "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> geo_pose "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> geo_vps "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> input_devcaps "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> input_eye "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> input_hand "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> input_haptic "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> render_gpu_api "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> scene_container "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        openxr -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> audio_room "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> geo_anchor_local "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> geo_tiles "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> input_devcaps "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> input_hand "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> input_haptic "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> physics_collision "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> physics_joint "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> physics_material "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> physics_rigid "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> physics_trigger "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_splat "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        playcanvas -> scene_units "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> audio_voice "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> deliver_bundle "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> input_hand "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> logic_behaviour "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> logic_budget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        recroom -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> net_address "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> net_interest "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> net_replication "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> persist_inventory "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> physics_rigid "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        recroom -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> audio_room "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> audio_spatial "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> audio_voice "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> avatar_body "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> avatar_expression "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> avatar_identity "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> deliver_cdn "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> identity_exchange "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> identity_rights "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> identity_social "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> input_eye "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> input_hand "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> input_haptic "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> input_session "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> logic_behaviour "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> logic_script "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_authority "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_discovery "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_handoff "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_media "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> net_transport "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> persist_content_addr "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> persist_inventory "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> persist_prefs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        resonite -> render_gpu_api "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_post "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_splat "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_animation "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_geometry "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_morph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_provenance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_transform "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        resonite -> scene_units "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> audio_occlusion "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> audio_room "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> audio_voice "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_body "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_expression "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_identity "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_retarget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> avatar_wearable "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> deliver_bundle "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> deliver_cdn "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_credential "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_exchange "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_privacy "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_rights "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_root "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> identity_social "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> input_devcaps "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> input_haptic "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> logic_behaviour "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> logic_budget "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> logic_sandbox "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_address "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_discovery "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_handoff "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_interest "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_media "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_prediction "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> net_time "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> persist_inventory "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> persist_prefs "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> persist_world "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> physics_determinism "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> physics_joint "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> physics_material "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_raster "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_animation "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_container "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_licence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_morph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        roblox -> scene_units "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> deliver_bundle "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> deliver_version "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> input_controller "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> net_address "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> net_handoff "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> net_transport "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> render_raster "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_compose "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_provenance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_transform "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        rp1 -> scene_units "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> audio_stream "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> audio_voice "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> avatar_body "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> avatar_identity "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> deliver_cdn "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> identity_capability "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> identity_credential "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> identity_exchange "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_interest "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_media "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> net_transport "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_container "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        teleportxr -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> audio_spatial "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> audio_voice "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> avatar_retarget "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> geo_anchor_local "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> input_hand "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> physics_collision "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> physics_material "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> physics_rigid "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_post "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_splat "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_text "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_compose "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_container "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_licence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_material_x "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        threejs -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> avatar_identity "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_capability "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_credential "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_exchange "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_privacy "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_rights "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_root "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        um -> identity_social "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> net_handoff "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> persist_inventory "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> persist_prefs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        um -> scene_provenance "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        unity -> audio_room "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> audio_voice "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> avatar_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> avatar_retarget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> avatar_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> deliver_bundle "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> deliver_cdn "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> deliver_version "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> geo_anchor_local "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> geo_indoor "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> identity_root "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> identity_social "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> input_controller "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> input_eye "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> input_hand "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> input_haptic "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> input_session "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> logic_agent "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> logic_behaviour "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_authority "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_discovery "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_interest "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_media "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_prediction "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_presence "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_replication "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_session "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_time "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> net_transport "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> persist_inventory "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> persist_prefs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_determinism "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_joint "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_soft "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_post "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> render_volumetric "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_material_x "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unity -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> audio_occlusion "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> audio_room "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> audio_stream "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> audio_voice "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> avatar_body "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> avatar_expression "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> avatar_lod "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> avatar_retarget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> deliver_bundle "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> deliver_cdn "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> geo_anchor_local "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> geo_anchor_shared "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> geo_crs "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> geo_pose "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> geo_tiles "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> identity_root "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> identity_social "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> input_eye "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> input_hand "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> input_haptic "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> input_session "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> logic_agent "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> logic_behaviour "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> net_discovery "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> net_handoff "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_interest "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_media "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_prediction "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_presence "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_session "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> net_transport "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> physics_determinism "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> physics_joint "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> physics_material "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> physics_soft "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> render_text "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> render_volumetric "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> scene_compose "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_morph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        unreal -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        unreal -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        usd -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        usd -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        usd -> scene_animation "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        usd -> scene_compose "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        usd -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        usd -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        usd -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vc -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vc -> identity_credential "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vc -> identity_privacy "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vc -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vc -> persist_content_addr "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vc -> scene_provenance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> audio_room "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> audio_spatial "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> audio_voice "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> avatar_body "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> avatar_expression "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> avatar_identity "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> avatar_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> avatar_retarget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> deliver_bundle "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> deliver_version "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> identity_privacy "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        vrchat -> identity_rights "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> identity_social "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> input_controller "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> input_eye "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> input_hand "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> input_haptic "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> input_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> logic_agent "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> logic_behaviour "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> logic_budget "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> logic_sandbox "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> logic_script "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_address "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_authority "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_discovery "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_handoff "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_interest "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_media "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_prediction "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "reported"
            }
        }

        vrchat -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> net_transport "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "reported"
            }
        }

        vrchat -> persist_inventory "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> persist_prefs "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> persist_world "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> physics_joint "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> physics_soft "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> render_lod "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> render_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> render_post "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "reported"
            }
        }

        vrchat -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_container "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_morph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrchat -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> avatar_body "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> avatar_expression "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> avatar_retarget "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> avatar_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> identity_rights "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> physics_collision "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> physics_soft "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> render_material "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_animation "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_geometry "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_licence "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_material_x "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_morph "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_provenance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        vrm -> scene_units "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> deliver_version "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> input_devcaps "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> logic_budget "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> render_raster "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> scene_instancing "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> scene_texture "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webgpu -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> avatar_skeleton "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> deliver_conformance "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> deliver_version "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> geo_anchor_local "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> geo_anchor_shared "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> geo_indoor "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> identity_capability "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> input_controller "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> input_devcaps "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> input_hand "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> input_haptic "through an extension" {
            tags "via-extension"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> input_session "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> render_lighting "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> scene_transform "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        webxr -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        wow -> avatar_body "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> deliver_cdn "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> deliver_conformance "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        wow -> geo_pose "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        wow -> identity_root "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> input_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> net_address "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        wow -> net_handoff "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> net_presence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> net_session "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> net_transport "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> render_camera "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> scene_container "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> scene_graph "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        wow -> scene_licence "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        wow -> scene_transform "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        wow -> scene_units "conflicts — will not interoperate" {
            tags "conflicts"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> audio_occlusion "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> audio_room "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> audio_source "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> audio_spatial "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> audio_stream "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> avatar_body "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> avatar_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> avatar_wearable "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> deliver_conformance "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> geo_crs "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> geo_pose "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> geo_tiles "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> logic_behaviour "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> logic_sandbox "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> logic_script "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> net_handoff "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> net_replication "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> net_time "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> physics_collision "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> physics_joint "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> physics_material "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> physics_rigid "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> physics_trigger "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> render_camera "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> render_gpu_api "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> render_lighting "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> render_lod "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> render_text "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> render_volumetric "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_animation "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_compose "partial" {
            tags "partial"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_container "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_geometry "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_graph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_material_x "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_morph "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_skeleton "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_texture "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_transform "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

        x3d -> scene_units "built in" {
            tags "native"
            properties {
                "confidence" "verified"
            }
        }

    }

    views {

        systemLandscape "landscape" "Every subject on the map, and the stack they are measured against." {
            include *
            autoLayout
        }

        container stack "groups" "The 12 capability groups inside the stack." {
            include *
            autoLayout
        }

        component render "component_render" "Rendering & presentation: 10 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component scene "component_scene" "Scene & assets: 14 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component avatar "component_avatar" "Avatars: 7 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component physics "component_physics" "Physics & simulation: 7 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component audio "component_audio" "Audio: 6 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component net "component_net" "Networking & session: 12 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component identity "component_identity" "Identity, trust & rights: 7 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component geo "component_geo" "Spatial & geospatial: 7 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component input "component_input" "Input & devices: 6 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component logic "component_logic" "Logic & behaviour: 5 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component persist "component_persist" "Persistence & storage: 4 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        component deliver "component_deliver" "Packaging & delivery: 4 capabilities and the subjects that reach them." {
            include *
            autoLayout
        }

        styles {
            element "Element" {
                color #1B1D1A
                background #F7F6F1
                stroke #A9A79A
                strokeWidth 2
                fontSize 22
            }
            element "stack" {
                background #E2E1D8
                stroke #1B1D1A
                shape RoundedBox
            }
            element "Container" {
                background #E2E1D8
                stroke #A9A79A
                shape RoundedBox
            }
            element "Component" {
                background #F7F6F1
                stroke #C7C5B8
                shape Component
            }
            element "protocol" {
                stroke #A33328
                strokeWidth 3
            }
            element "format" {
                stroke #7E8177
            }
            element "standard" {
                background #CFE0E1
                stroke #2C5F6B
            }
            element "web-runtime" {
                background #E2E1D8
                stroke #2C5F6B
            }
            element "game-engine" {
                background #EBDCC2
                stroke #8A6634
            }
            element "platform" {
                background #F0D6D0
                stroke #A33328
            }
            element "protocol-subject" {
                background #CFE0E1
                stroke #8A6634
            }
            element "project" {
                background #F7F6F1
                stroke #8A6634
            }
            relationship "native" {
                color #1B1D1A
                style solid
                thickness 3
            }
            relationship "via-extension" {
                color #2C5F6B
                style solid
                thickness 2
            }
            relationship "partial" {
                color #8A6634
                style dashed
                thickness 2
            }
            relationship "conflicts" {
                color #A33328
                style solid
                thickness 4
            }
        }
    }
}
