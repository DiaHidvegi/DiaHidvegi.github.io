// Project content. Edit here; projects.html renders this list.
const PROJECTS = [
  {
    "title": "Dexterous Manipulation via Embedded Posture Graphs of Hands with N-DoF",
    "meta": "Soft Robotics Lab, ETH Zürich, 2026 - present. Supervisors: Chenyu Yang, Davide Liconti, Prof Dr Robert Katzschmann",
    "paragraphs": [
      "A co-embedded graph of hand postures spanning end effectors with different morphologies and degrees of freedom, built for generalized posture mapping. The graph captures how postures relate to one another and supports representation learning on a nonlinear manifold, yielding a single shared representation across hands.",
      "The embedding serves as input for training a neural cross-embodiment retargeter between N-DoF hands. It may also provide a compact posture representation to improve sample efficiency in reinforcement learning and other downstream tasks."
    ],
    "figures": [
      {
        "video": "assets/media/dexterous-retarget.mp4",
        "poster": "assets/media/dexterous-retarget-poster.jpg",
        "alt": "A tracked human hand mesh on the left and the ORCA robot hand on the right, mirroring its posture in real time",
        "caption": "Live retargeting: the tracked human hand (left) and the ORCA hand (right) following it through the learned shared posture space."
      }
    ],
    "links": [],
    "short": "Dexterous Manipulation",
    "viz": {
      "type": "orbit"
    },
    "links_label": "Stack",
    "media": {
      "video": null,
      "image": "assets/media/dexterous.jpg",
      "alt": "Teleoperating the ORCA robot hand on a Franka arm with a data glove, placing an egg into a carton"
    },
  },
  {
    "title": "Vision-Language-Action Models for Pick-and-Place",
    "meta": "ETH Zürich, 2026",
    "paragraphs": [
      "Fine-tuned SmolVLA, π0, π0.5, OpenVLA and FlowerVLA on LeRobot teleoperation demonstrations for two pick-and-place tasks: sorting objects into bowls, and placing objects on photos of celebrities.",
      "The goal was strong performance on both halves of the model: the visual backbone and language understanding. Bowl commands went beyond naming a colour, with instructions such as “Put the banana into the 2nd bowl from the left” or “Place the banana into the bowl that is not green or blue”. For the celebrity task, the model also had to recognise out-of-distribution celebrities it had never seen in training."
    ],
    "figures": [
      {
        "src": "assets/media/vla-photo.jpg",
        "alt": "The SO-101 arm on its overhead camera rig, with celebrity photos and a can on the table, the leader arm and a laptop running the policy in the foreground",
        "caption": "The setup for the third task: the arm, its camera rig, the leader arm used for teleoperation, and the celebrity photos as placement targets."
      }
    ],
    "links": [
      {
        "name": "LeRobot",
        "url": "https://github.com/huggingface/lerobot"
      },
      {
        "name": "SmolVLA",
        "url": "https://huggingface.co/lerobot/smolvla_base"
      },
      {
        "name": "π0 / π0.5",
        "url": "https://github.com/Physical-Intelligence/openpi"
      },
      {
        "name": "OpenVLA",
        "url": "https://github.com/openvla/openvla"
      },
      {
        "name": "FlowerVLA",
        "url": null
      }
    ],
    "short": "Vision-Language-Action Models",
    "viz": {
      "type": "sort"
    },
    "links_label": "Stack",
    "media": {
      "video": "assets/media/vla.mp4",
      "poster": "assets/media/vla-poster.jpg",
      "alt": "SO-101 arm picking up a banana and dropping it into a red bowl"
    },
    "points": [
      "Setup: an SO-101 arm with a single wrist camera, trained on 150 to 200 teleoperated demonstrations recorded with a leader arm.",
      "Lessons: adding the end-effector height to the state fixed early grasping, and unfreezing the vision encoder was needed for the model to learn bowl colours."
    ]
  },
  {
    "title": "NAICS-Aware Graph Neural Networks for Large-Scale POI Co-visitation Prediction",
    "meta": "Intelmatix Labs, MIT, PSU, 2024 - 2025. Collaborators: Yazeed Alrubyli, Dr Omar Alomeir, Dr Abrar Wafa, Dr Hend Alrasheed, Dr Mohsen Bahrami",
    "paragraphs": [
      "A GraphSAGE-based architecture that combines learnable embeddings of the NAICS business taxonomy with multi-modal spatial and temporal features to predict population-level co-visitation between 92,486 brands across 48 US states.",
      "By learning relationships between business categories end to end on 45.3 million graph edges, the model improves R² by 157% over state-of-the-art baselines and makes edge regression tractable on extremely sparse co-visitation networks."
    ],
    "figures": [
      {
        "src": "assets/media/naics-architecture.png",
        "alt": "Full model architecture from NAICS code embeddings through node fusion, a five-layer GraphSAGE encoder, edge assembly and an edge MLP",
        "caption": "Model architecture, from the paper.",
        "tall": true
      }
    ],
    "links": [
      {
        "name": "arXiv:2507.19697",
        "url": "https://arxiv.org/abs/2507.19697"
      }
    ],
    "short": "NAICS-Aware Graph Neural Networks",
    "viz": {
      "type": "network"
    },
    "links_label": "Paper",
    "media": {
      "image": "assets/media/naics-tile.png",
      "alt": "Model architecture detail: GraphSAGE encoder, edge assembly and edge MLP producing the co-visitation prediction",
      "detail": false
    }
  },
  {
    "title": "Curriculum Learning for Visual Model-Based RL for Continuous Robotics Tasks",
    "meta": "Autonomous Learning and Predictive Intelligence Lab, UZH, 2025. Supervisors: Prof Dr Giorgia Ramponi",
    "paragraphs": [
      "An investigation into how curriculum learning affects DreamerV3 training, with a focus on convergence speed and sample efficiency. We designed progressive training curricula for vision-based control tasks, evaluated them against standard training, and identified the conditions under which a curriculum substantially accelerates policy convergence."
    ],
    "figures": [
      {
        "src": "assets/curriculum-learning.png",
        "alt": "Smoothed learning curves comparing curriculum training against the baseline over 800 thousand training steps",
        "caption": "Episode score over training: the curriculum run (green) against the baseline (pink)."
      }
    ],
    "links": [
      {
        "name": "JAX",
        "url": "https://docs.jax.dev/en/"
      },
      {
        "name": "MuJoCo",
        "url": "https://gymnasium.farama.org/environments/mujoco/"
      },
      {
        "name": "DreamerV3",
        "url": "https://github.com/danijar/dreamerv3"
      },
      {
        "name": "FastAPI",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "name": "Docker",
        "url": "https://www.docker.com/"
      }
    ],
    "short": "Curriculum Learning for Visual RL",
    "viz": {
      "type": "curves"
    },
    "links_label": "Stack",
    "media": {
      "video": "assets/media/hopper.mp4",
      "poster": "assets/media/hopper-poster.jpg",
      "alt": "Three MuJoCo hoppers side by side: standing low, standing taller, and hopping forward"
    }
  },
  {
    "title": "Energy-efficient Path Planning for Autonomous Drones in Inspection Tasks",
    "meta": "Robotics & Perception Group, UZH, 2025. Supervisors: Leonard Bauersfeld, Prof Dr Davide Scaramuzza",
    "paragraphs": [
      "Sampling-based path planners often fail to account for drone dynamics when judging the cost and feasibility of reaching a sampled point. This work extends RRT* with 3D Dubins curves, which constrain the planned path to feasible drone motion, and enlarges the state space with energy-related variables such as velocity and, indirectly, turn curvature. The planner then minimizes the energy the drone spends along the resulting path."
    ],
    "figures": [
      {
        "src": "assets/drone-energy-velocity.png",
        "alt": "Energy per unit length and power consumption as a function of velocity",
        "caption": "Energy per metre (left) and power (right) as functions of flight speed. Energy used per metre is lowest at around 10 to 13 m/s, while the power demand rises steeply above that.",
        "wide": true
      },
      {
        "src": "assets/drone-energy-radii.png",
        "alt": "Energy consumption as a function of velocity for different turning radii",
        "caption": "Energy used per metre in a turn, against flight speed, for turning radii from 3 to 10 m. Tighter turns cost more energy, and are cheapest at lower speeds.",
        "wide": true
      }
    ],
    "links": [
      {
        "name": "ROS",
        "url": "https://github.com/ros-infrastructure/www.ros.org"
      },
      {
        "name": "Agilicious",
        "url": "https://github.com/uzh-rpg/agilicious"
      },
      {
        "name": "PythonRobotics",
        "url": "https://github.com/AtsushiSakai/PythonRobotics"
      }
    ],
    "short": "Energy-efficient Drone Path Planning",
    "viz": {
      "type": "tree"
    },
    "links_label": "Stack",
    "media": {
      "video": "assets/media/drone.mp4",
      "poster": "assets/media/drone-poster.jpg",
      "alt": "A small drone flying through an indoor hall",
      "detail": false
    }
  },
  {
    "title": "Visual Odometry Pipeline",
    "meta": "Robotics & Perception Group, 2024. Collaborators: Jakob Schlichting, Nicolas Schuler, Maximilian Stralz",
    "paragraphs": [
      "A monocular visual odometry pipeline that estimates camera motion on three datasets: KITTI, Malaga and Parking. It has two stages, initialization and continuous tracking. Features are detected with the Shi-Tomasi corner detector and tracked with Lucas-Kanade optical flow; poses are estimated with P3P-RANSAC and refined with Gauss-Newton optimization. The code is available <a href=\"https://github.com/DiaHidvegi/visual-odometry\" target=\"_blank\" rel=\"noopener\">here</a>."
    ],
    "figures": [
      {
        "src": "assets/visual-odometry.jpg",
        "alt": "Visual odometry dashboard showing tracked landmarks on a street frame, landmark counts, and the global and local trajectories"
      }
    ],
    "links": [
      {
        "name": "OpenCV",
        "url": "https://github.com/opencv/opencv"
      },
      {
        "name": "NumPy",
        "url": "https://numpy.org/"
      },
      {
        "name": "SciPy",
        "url": "https://scipy.org/"
      }
    ],
    "short": "Visual Odometry",
    "viz": {
      "type": "odometry"
    },
    "links_label": "Stack",
    "media": {
      "video": "assets/media/visual-odometry.mp4",
      "poster": "assets/media/visual-odometry-poster.jpg",
      "alt": "Visual odometry dashboard: tracked features on a street scene, landmark counts, global and local trajectory"
    }
  },
  {
    "title": "Knowledge Graph Retrieval-Based LLM Agent for Factual Querying",
    "meta": "UZH, 2024. Collaborators: Raffael Botschen",
    "paragraphs": [
      "A chat agent that answers natural language questions from factual information stored in several knowledge graphs, each built from free-text documents. The Llama API handles prompt-engineered query classification and response generation, while the system generates SPARQL queries to retrieve the relevant facts, with entity matching applied first to narrow the candidate nodes. The result is accurate, context-aware answers grounded in structured retrieval, delivered through a natural conversation on the frontend."
    ],
    "figures": [],
    "links": [
      {
        "name": "Ollama",
        "url": "https://github.com/ollama/ollama"
      },
      {
        "name": "NumPy",
        "url": "https://numpy.org/"
      },
      {
        "name": "SciPy",
        "url": "https://scipy.org/"
      },
      {
        "name": "RDFLib",
        "url": "https://rdflib.readthedocs.io"
      },
      {
        "name": "SPARQL",
        "url": "https://www.w3.org/TR/sparql11-query/"
      }
    ],
    "short": "Knowledge Graph LLM Agent",
    "viz": {
      "type": "walker"
    },
    "links_label": "Stack",
    "media": {
      "video": "assets/media/knowledge-graph.mp4",
      "poster": "assets/media/knowledge-graph-poster.jpg",
      "alt": "A question about Titanic is matched to its Wikidata entity, a SPARQL query follows the director edge to James Cameron, and the agent answers"
    },
    "points": [
      "The animation above is a very simplified example, for illustration only."
    ]
  },
  {
    "title": "Vision-based Traffic Surveillance",
    "meta": "Intelmatix, 2026 - present",
    "paragraphs": [
      "Object detection and multi-object tracking models for vision-based traffic surveillance, running on live camera streams.",
      "Details are limited as this is ongoing company work."
    ],
    "figures": [],
    "links_label": "Stack",
    "links": [
      {
        "name": "RF-DETR",
        "url": "https://github.com/roboflow/rf-detr"
      },
      {
        "name": "YOLO26",
        "url": "https://docs.ultralytics.com/models/yolo26/"
      },
      {
        "name": "DeepStream",
        "url": "https://developer.nvidia.com/deepstream-sdk"
      }
    ],
    "short": "Traffic Surveillance",
    "viz": {
      "type": "traffic"
    },
    "media": {
      "video": "assets/media/traffic.mp4",
      "poster": "assets/media/traffic-poster.jpg",
      "alt": "Street camera view with tracked vehicles in bounding boxes and live zone counts, including a restricted-zone alert"
    }
  },
  {
    "title": "Geospatial Site Selection Engine",
    "meta": "Intelmatix, 2022 - present",
    "paragraphs": [
      "A location intelligence engine that models the urban dynamics of a city for tasks such as real estate valuation and choosing the site of a new quick-service restaurant branch. It combines a graph-based market saturation model, a branch cannibalization model, accessibility scoring for points of interest and demographic groups, route optimization and a catchment model to predict sales at unseen locations and recommend the highest-impact site for a new branch.",
      "The value prediction model takes accessibility scores, market saturation, a cannibalization score derived from a location's catchment and surrounding road network, and a set of demographic variables. It can be trained on different targets, such as future sales for a site or the value of land or real estate, which lets the engine extend to a range of urban and geospatial analytics use cases."
    ],
    "figures": [
      {
        "caption": "Road network of Riyadh as modelled by the engine.",
        "video": "assets/media/site-selection.mp4",
        "poster": "assets/media/site-selection-poster.jpg",
        "alt": "Road network of Riyadh"
      },
      {
        "src": "assets/accessibility-heatmap.png",
        "alt": "Heatmap of accessibility scores for 853 parcels zoned for restaurants"
      },
      {
        "src": "assets/accessibility-distance.png",
        "alt": "Accessibility score for Saudi females aged 20 to 35 from their work locations to a fast food branch in Riyadh, plotted against distance"
      }
    ],
    "links": [
      {
        "name": "PyTorch",
        "url": "https://pytorch.org/"
      },
      {
        "name": "scikit-learn",
        "url": "https://scikit-learn.org/"
      },
      {
        "name": "NumPy",
        "url": "https://numpy.org/"
      },
      {
        "name": "FastAPI",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "name": "Docker",
        "url": "https://www.docker.com/"
      },
      {
        "name": "AWS S3",
        "url": "https://aws.amazon.com/s3/"
      }
    ],
    "short": "Geospatial Site Selection",
    "viz": {
      "type": "sites"
    },
    "links_label": "Stack",
    "media": {
      "video": "assets/media/site-selection.mp4",
      "poster": "assets/media/site-selection-poster.jpg",
      "alt": "Road network of Riyadh rendered by the site selection engine, zooming out from a district to the whole city"
    }
  },
  {
    "title": "Healthcare Agent-based Policy Simulator with Learned Action Functions",
    "meta": "Intelmatix, 2022 - 2023",
    "paragraphs": [
      "A policy simulation engine that links the development of a country's healthcare workforce to government policy changes in immigration, medical education, workforce allocation and employment requirements.",
      "Policy effects are measured as the number of practitioners per 1,000 population in each specialization. Every simulated year, a new trainee cohort with its own demographics and university GPA enters each specialization. Each trainee agent acts according to its specialization requirements and training center: taking exams, taking a gap year, switching specialization, or dropping out. Graduates become senior registrars and may later become consultants, and the full workforce is recorded at the end of the run. Practitioners are modeled as agents whose actions are predicted with classical machine learning models.",
      "The engine helps healthcare decision-makers understand the impact of candidate policies and choose the one best suited to national targets, such as a required number of registered nurses or a higher quality of training."
    ],
    "figures": [],
    "links": [
      {
        "name": "Mesa",
        "url": "https://mesa.readthedocs.io"
      },
      {
        "name": "FastAPI",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "name": "Docker",
        "url": "https://www.docker.com/"
      },
      {
        "name": "AWS S3",
        "url": "https://aws.amazon.com/s3/"
      }
    ],
    "short": "Healthcare Policy Simulator",
    "viz": {
      "type": "agents"
    },
    "links_label": "Stack"
  },
  {
    "title": "Unstructured Financial Data Extractor",
    "meta": "Dealogic, 2021 - 2022",
    "paragraphs": [
      "A data extraction engine that uses NLP methods such as named-entity recognition, sentiment analysis and text mining to pull accurate financial data from unstructured sources: free text, PDFs and legal filings published by the US Securities and Exchange Commission (SEC).",
      "The project's goal was a graph database of special purpose acquisition companies (SPACs), their acquisition targets, their sponsors and sponsor affiliates, and the individuals connected to each of these entities. Alongside the relationships, it captures attributes of the entities themselves, including stock and warrant prices, ticker symbols and exchanges, purchase conditions and warrant expiry dates.",
      "Filings are collected and their data points extracted in near real time, shortly after publication on the SEC. A named-entity recognition model trained on historical SEC documents handles a range of filing types, including 424B4, S-1, and quarterly and annual reports."
    ],
    "figures": [],
    "links": [],
    "short": "Financial Data Extractor",
    "viz": {
      "type": "stream"
    },
    "links_label": "Stack"
  },
  {
    "title": "Automated Credit Underwriting Algorithm",
    "meta": "Anyfin, 2019 - 2020",
    "paragraphs": [
      "A credit underwriting algorithm that takes a loan applicant's profile and decides whether to offer them the option to refinance their loan. When an offer is made, it also recommends the interest rate, drawing on an internal credit scoring model, the applicant's probability of default, payment history, previous applications and other variables.",
      "My main contribution was improving the default prediction model through a new feature scoring method based on the apriori algorithm, weight of evidence and information value statistics."
    ],
    "figures": [],
    "links": [],
    "short": "Credit Underwriting",
    "viz": {
      "type": "gate"
    },
    "links_label": "Stack"
  }
];
